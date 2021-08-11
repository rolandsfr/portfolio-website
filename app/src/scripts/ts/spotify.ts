(async () => {
  // Link to get a code for the first request
  // console.log(`https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${myurl}&scope=user-read-private%20user-read-email%20user-read-currently-playing%20user-read-playback-state&state=34fFs29kd09`)

  // Authorizing using code / refresh token and getting the access token
  let resp = await fetch(`./.netlify/functions/fetchSpotifyToken`);

  let { access_token }: { access_token: string } = await resp.json();

  // let response:
  // let access_token: string = await auth.json();

  // Very first request to spotify web api's to see what user us currently listenint to
  getPlayback();

  // Looping the request (for updates)
  setInterval(getPlayback, 5000);

  async function getPlayback() {
    // Sending request to get information about what user is currently lisetning to
    let playback = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: "Bearer " + access_token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const errorElement = document.querySelector(".error") as HTMLElement;
    const container = document.querySelector(".container_inner") as HTMLElement;
    const widgetTitle = document.querySelector(
      ".widget_title p"
    ) as HTMLElement;

    try {
      let playbackReponse: any = await playback.json();

      // Showing all the infotmation
      container.style.display = "flex";
      widgetTitle.textContent = "Currently vibing with";
      errorElement.style.display = "none";

      let image = document.querySelector(".cover")!;
      let trackName = document.querySelector("#track-name")!;
      let artist = document.querySelector("#artist")!;

      image.setAttribute(
        "src",
        playbackReponse["item"]["album"]["images"][0]["url"]
      );
      trackName.textContent = playbackReponse["item"]["name"];
      let artists = playbackReponse["item"]["artists"].map(
        (artist: { name: string }) => {
          return artist["name"];
        }
      );

      artist.textContent = artists.join(", ");
    } catch (e) {
      // Show nothing is user is offline (or if there were any other errors during the request)

      errorElement.style.display = "inline-block";

      container.style.display = "none";

      widgetTitle.textContent = "Currently offline";
    }
  }
})();

// Animating "Nothing to show" (scrolling animation of some sort)
let offsetTop = 100;
let ratio =
  $("#container .error").outerHeight()! / $("#container").outerHeight()!;
let h = $("#container").height();

$(window).resize(() => {
  ratio =
    $("#container .error").outerHeight()! / $("#container").outerHeight()!;
  h = $("#container").height();
});

const errorEl = document.querySelector(".error") as HTMLElement;

setInterval(() => {
  if (h) {
    if (offsetTop < (-h * ratio) / 1.1) {
      errorEl.style.marginTop = "0";
      offsetTop = 100;
    }

    errorEl.style.marginTop = offsetTop + "%";
    offsetTop -= 0.1;
  }
}, 10);
