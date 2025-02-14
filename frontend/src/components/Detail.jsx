import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export const Detail = () => {
  const { id } = useParams();  // Get ID from URL
  const [news, setNews] = useState(null);

  useEffect(() => {
    if (!id) {
      console.error("No ID found in URL");
      return;
    }

    const fetchNewsDetail = async () => {
      try {
        console.log("Fetching news for ID:", id);  // Debugging
        const response = await axios.get(`http://localhost:3000/api/news/${id}`);
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error.response ? error.response.data : error.message);
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (!news) return <p>Loading...</p>;

  return (
    <div>
      <h1>{news.title}</h1>
      <p>{news.content}</p>
    </div>
  );
};

// export default Detail;
