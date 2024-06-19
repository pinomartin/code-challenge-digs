import { useEffect, useState } from "react";
import { ChallengeData } from "../app/models/ChallengeData";
import { BASE_URL } from "@/constants/api";

const useCalendar = () => {
  const [data, setData] = useState<ChallengeData>();
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const response = await fetch(BASE_URL);
    const result: ChallengeData = await response.json();
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
  };
};

export default useCalendar;
