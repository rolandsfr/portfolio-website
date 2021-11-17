// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
import { Handler } from "@netlify/functions";
import { Response } from "@netlify/functions/src/function/response";
const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API });

const handler: Handler = async (event): Promise<Response> => {
  const databaseId = "6a6070680e4b4c678e192dfc6bc2b791";

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    let { results } = response;

    const responseObject = {
      url: results[2].properties.imageUrl.url,
    };

    console.log("Function is up and running");

    return {
      statusCode: 200,
      body: JSON.stringify(responseObject),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.message };
  }
};

module.exports = { handler };
