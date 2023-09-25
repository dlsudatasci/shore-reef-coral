import styles from "@styles/survey-display.module.css";
import { FC } from "react";
import { Buoy, Mask } from "./icons";

type SurveyInfoProps = {
  stationName: string;
  date: string;
  latitude: string;
  longitude: string;
};
const SurveyInfo: FC<SurveyInfoProps> = ({stationName, date, latitude, longitude}) => {
  return (
    <section
      className={
        styles["survey-header"] + " text-primary font-comic-cat px-2 mb-8"
      }
    >
      <div className="grid md:grid-cols-[4fr_3fr_60px] max-w-3xl mx-auto gap-y-8">
        <div className="grid border-4 md:border-r-2">
          <div className="border-b-2 pl-3">
            <p>Survey Date &amp; Time</p>
            <p>{date}</p>
          </div>
          <div className="border-t-2 pl-3">
            <p>Station Name</p>
            <p>{stationName}</p>
          </div>
        </div>
        <div className="grid grid-cols-[1fr_4fr] grid-rows-3 border-4 md:border-x-2">
          <div className="col-span-full border-b-2">
            <p className="text-center">Starting Corner Coordinates</p>
          </div>
          <div className="row-span-2 border-t-2 border-r-2 grid place-items-center">
            <Buoy className="fill-primary" height={30} width={30} />
          </div>
          <div className="flex justify-between border-y-2 border-l-2 px-2">
            <p>Longtitude</p>
            <p>{longitude}</p>
          </div>
          <div className="flex justify-between border-l-2 border-t-2 px-2">
            <p>Latitude</p>
            <p>{latitude}</p>
          </div>
        </div>
        <div className="border-l-2 border-4 place-items-center hidden md:grid">
          <Mask className="fill-primary" height={50} width={50} />
        </div>
      </div>
    </section>
  );
};

export default SurveyInfo;
