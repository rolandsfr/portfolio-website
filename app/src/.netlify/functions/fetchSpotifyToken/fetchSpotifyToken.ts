// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
import { Handler } from "@netlify/functions";
import { Response } from "@netlify/functions/src/function/response";

import fetch from "node-fetch";

const handler: Handler = async (event): Promise<Response> => {
  const { SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH } = process.env;

  let grant_type = "refresh_token";
  let code_type = "refresh_token";

  const client_id = "046b829766094645b6cef22e6583cfec";
  let myurl = "https:%2F%2Fexample.com%2Fcallback";

  // Link to get a code for the first request
  // console.log(`https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${myurl}&scope=user-read-private%20user-read-email%20user-read-currently-playing%20user-read-playback-state&state=34fFs29kd09`)

  // Authorizing using code / refresh token and getting the access token
  let access_token: string | null;
  try {
    let auth = await fetch(`https://accounts.spotify.com/api/token`, {
      method: "POST",
      body: `grant_type=${grant_type}&client_id=${client_id}&client_secret=${SPOTIFY_CLIENT_SECRET}&${code_type}=${SPOTIFY_REFRESH}&redirect_uri=${myurl}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    let response: { [key: string]: string } = await auth.json();
    access_token = response["access_token"];
  } catch (e) {
    access_token = e.message;
  }

  // // Sending request to get information about what user is currently lisetning to
  // const fethedActivity = await fetch(
  //   "https://api.spotify.com/v1/me/player/currently-playing",
  //   {
  //     method: "GET",
  //     headers: {
  //       Authorization: "Bearer " + access_token,
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );

  // const spotifyActivity = JSON.stringify(fethedActivity);

  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ access_token }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
