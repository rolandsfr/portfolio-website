// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
import { Handler } from "@netlify/functions";
import { Response } from "@netlify/functions/src/function/response";
const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NOTION_API });

const handler: Handler = async (event): Promise<Response> => {
  const databaseId = "7b4380f82c6644c1859f9bb4b12a20a2";

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    let { results } = response;

    results = results.sort((a, b) => {
      let leftHand: number = a.properties.id.number;
      let rightHand: number = b.properties.id.number;

      return leftHand - rightHand;
    });

    let matchingResults = results.map((result) => {
      return {
        title: result.properties.Name.title[0].plain_text,
        watermark: result.properties.watermark.rich_text[0].plain_text,
        description: result.properties.Description.rich_text[0].plain_text,
        thumbnail_url:
          result.properties.thumbnail_url.rich_text[0].text.link.url,
        project_url: result.properties.work_url.url,
      };
    });

    console.log("Function is up and running");

    return {
      statusCode: 200,
      body: JSON.stringify(matchingResults),
    };
  } catch (error) {
    return { statusCode: 500, body: error.message };
  }
};

module.exports = { handler };
