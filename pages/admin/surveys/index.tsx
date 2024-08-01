// Components
import { SurveyTableAdmin } from "@components/survey-table";
import AdminLayout from "@components/layouts/admin-layout";

// Hooks
import { useAdminAccess } from "@lib/useRoleAccess";
import { useState, useEffect, useCallback } from "react";

// API
import axios from "axios";

const Surveys = () => {
  
  useAdminAccess();

  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [filters, setFilters] = useState({ stationName: "" });
  const [inputValues, setInputValues] = useState({ stationName: "" });
  const [sorting, setSorting] = useState({ sortBy: "date", sortOrder: "desc" });

  const fetchData = useCallback(async () => {
    const { stationName } = filters;
    const { sortBy, sortOrder } = sorting;
    const response = await axios.get("/api/admin/surveys", {
      params: {
        page: currentPage,
        pageSize,
        stationName,
        sortBy,
        sortOrder,
      },
    });
    setData(response.data.surveys);
    setTotalPages(response.data.totalPages);
  }, [filters, sorting, currentPage, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  const handleFilterButtonClick = () => {
    setFilters(inputValues);
    setCurrentPage(1); 
  };

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    setSorting({ sortBy, sortOrder });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between mt-8">
        <h1 className="text-3xl text-t-highlight">Surveys</h1>
      </div>
      <div className="my-8 flex gap-6 w-[30%]">
        <input
          type="text"
          name="stationName"
          placeholder="Station Name"
          value={inputValues.stationName}
          onChange={handleFilterChange}
        />
        <button className="bg-primary text-secondary rounded-full px-4 py-2 w-72" onClick={handleFilterButtonClick}>
          Filter
        </button>
      </div>
      <SurveyTableAdmin
        className="w-full mt-8"
        data={data}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleSortChange={handleSortChange}
      />
    </AdminLayout>
  );
};

export default Surveys;
