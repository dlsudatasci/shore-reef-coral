import { useForm } from 'react-hook-form';
import { ITeam, teamInfoSchema } from '@models/team';
import { yupResolver } from '@hookform/resolvers/yup';
import { Survey, useSurveyStore } from '@stores/survey-store';
import { shallow } from 'zustand/shallow';
import { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API calls
import LoadingSpinner from '@components/loading-spinner';
import { SurveyFormProps } from '.';

const storeSelector = (state: Survey) => [state.team, state.setTeam] as const;

type TeamsSummary = {
  teamId: number;
  teamName: string;
  leaderId: number;
  leaderFirstName: string;
  leaderLastName: string;
  leaderContactNo?: string | null;
};

export function TeamInformation({ submitHandler, backHandler }: SurveyFormProps) {
  const [team, setTeam] = useSurveyStore(storeSelector, shallow);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const { control, register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ITeam>({
    resolver: yupResolver(teamInfoSchema),
    defaultValues: team as ITeam,
  });

  const [teams, setTeams] = useState<TeamsSummary[]>([]);
  const [leaderName, setLeaderName] = useState<string>('');
  const [leaderNum, setLeaderNum] = useState<string>('');
  const selectedTeamId = watch('teamId');
  const leaderContact = watch('leaderNum');
  team.leaderNum = leaderContact;

  useEffect(() => {
    const fetchTeams = async () => {
      // setIsLoading(true);
      try {
        const response = await axios.get<TeamsSummary[]>('/api/surveys/teamInfo');
        setTeams(response.data);
        var defaultTeam;
        var i;
        for (i = 0; i < response.data.length; i++) {
          if (teams[i]) {
            if (teams[i].teamId == selectedTeamId) {
              defaultTeam = teams[i];
              break;
            }
          }
          
        }

        if (defaultTeam) {
          setValue('teamId', defaultTeam.teamId);
          setValue('leaderId', defaultTeam.leaderId);
          setLeaderName(`${defaultTeam.leaderFirstName} ${defaultTeam.leaderLastName}`);
          const leaderNumElement = document.getElementById('leaderNum') as HTMLInputElement;
          if (leaderNumElement) {
            leaderNumElement.value = String(defaultTeam.leaderContactNo);
          }
          team.leaderId = defaultTeam.leaderId;
          team.teamId = defaultTeam.teamId;
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [selectedTeamId, setValue]);

  useEffect(() => {
    const selectedTeam = teams.find(team => team.teamId === selectedTeamId);
    if (selectedTeam) {
      setValue('leaderId', selectedTeam.leaderId);
      setLeaderName(`${selectedTeam.leaderFirstName} ${selectedTeam.leaderLastName}`);
    }
  }, [selectedTeamId, setValue, teams]);

  const onSubmit = handleSubmit(data => {
    setTeam(data);
    if ((document.activeElement as HTMLInputElement)?.value === 'BACK') {
      return backHandler();
    }
    submitHandler();
  });

  if (isLoading) {
    return <LoadingSpinner borderColor="border-highlight" />;
  }

  return (
    <form id="survey-form" onSubmit={onSubmit}>
      <div className="control">
        <label htmlFor="team" className="text-secondary required">Team</label>
        <select id="team" {...register('teamId')} defaultValue="">
          <option value="" disabled>--Please select a team--</option>
          {teams.map(team => (
            <option key={team.teamId} value={team.teamId}>{team.teamName}</option>
          ))}
        </select>
        <p className="error text-secondary">{errors.teamId?.message}</p>
      </div>

      <div className="control" style={{ paddingBottom: '5%' }}>
        <label htmlFor="leaderName" className="text-secondary required">Team Leader</label>
        <input
          type="text"
          id="leaderName"
          className="input"
          value={leaderName}
          readOnly
        />
      </div>

      <div className="control" style={{ paddingBottom: '5%' }}>
        <label htmlFor="leaderNum" className="text-secondary">Team Leader Contact #</label>
        <input
          type="text"
          id="leaderNum"
          className="input"
          {...register('leaderNum')}
        />
      </div>

      {/* <div className="control">
        <label htmlFor="scientist" className="text-secondary required">Team Scientist</label>
        <input
          type="text"
          id="scientist"
          className="input"
          {...register('scientist', { required: 'Team scientist is required' })}
        />
        <p className="error text-secondary">{errors.scientist?.message}</p>
      </div> */}
      
      <div className="control">
        <label htmlFor="volunteer1" className="text-secondary required">Volunteer Member 1</label>
        <input
          type="text"
          id="volunteer1"
          className="input"
          {...register('volunteer1', { required: 'Volunteer member 1 is required' })}
        />
        <p className="error text-secondary">{errors.volunteer1?.message}</p>
      </div>

      <div className="control">
        <label htmlFor="volunteer2" className="text-secondary required">Volunteer Member 2</label>
        <input
          type="text"
          id="volunteer2"
          className="input"
          {...register('volunteer2', { required: 'Volunteer member 2 is required' })}
        />
        <p className="error text-secondary">{errors.volunteer2?.message}</p>
      </div>

      <div className="control">
        <label htmlFor="volunteer3" className="text-secondary required">Volunteer Member 3</label>
        <input
          type="text"
          id="volunteer3"
          className="input"
          {...register('volunteer3', { required: 'Volunteer member 3 is required' })}
        />
        <p className="error text-secondary">{errors.volunteer3?.message}</p>
      </div>

      <div className="control">
        <label htmlFor="volunteer4" className="text-secondary">Volunteer Member 4</label>
        <input
          type="text"
          id="volunteer4"
          className="input"
          {...register('volunteer4')}
        />
        <p className="error text-secondary">{errors.volunteer4?.message}</p>
      </div>

      <div className="control">
        <label htmlFor="volunteer5" className="text-secondary">Volunteer Member 5</label>
        <input
          type="text"
          id="volunteer5"
          className="input"
          {...register('volunteer5')}
        />
        <p className="error text-secondary">{errors.volunteer5?.message}</p>
      </div>

      <div className="control">
        <label htmlFor="volunteer6" className="text-secondary">Volunteer Member 6</label>
        <input
          type="text"
          id="volunteer6"
          className="input"
          {...register('volunteer6')}
        />
        <p className="error text-secondary">{errors.volunteer6?.message}</p>
      </div>
    </form>
  );
}

export default TeamInformation;
