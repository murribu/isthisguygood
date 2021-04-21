import axios from "axios";
import * as AWS from "aws-sdk";

export const handler = async () => {
  const axiosResponse = await axios.get(
    `https://bdfed.stitch.mlbinfra.com/bdfed/stats/player?stitch_env=prod&season=2021&sportId=1&stats=season&group=pitching&gameType=R&limit=9999&offset=0&sortStat=earnedRunAverage&order=asc&playerPool=ALL`
  );
  const stats = axiosResponse.data;
  console.log({ stats });
  const s3 = new AWS.S3();

  const params = {
    Bucket: process.env.destination_bucket || "",
    Key: `static/data/pitchers.2021.json`,
    Body: stats,
  };
  console.log({ params });
  await s3.putObject(params).promise();
};
