import { SurveyTableAdmin } from "@components/survey-table";
import { SAMPLE_SURVEY_DATA } from "../teams/[id]";
import AdminLayout from "@components/layouts/admin-layout";
import {useAdminAccess} from "@lib/useRoleAccess";

const Surveys = () => {
  
  useAdminAccess();

  return (
    <AdminLayout>
      <div className="flex justify-between mt-8">
        <h1 className="text-3xl text-t-highlight">Surveys</h1>
      </div>
      <div className="my-8 flex gap-6 w-[30%]">
        <input type="text" placeholder="Station Name" />
        <button className="bg-primary text-secondary rounded-full px-4 py-2 w-72">
          Filter
        </button>
      </div>
      <SurveyTableAdmin className="w-full mt-8 mb-20" data={SAMPLE_SURVEY_DATA} />
    </AdminLayout>
  );
};

export default Surveys;
