import { notionEndpoints } from "./notionEndpoints";
import { Record } from "./notionFetchInterfaces";

// preloader stuff
import Preload from "image-preload";
import { Order } from "image-preload";

const fetchNotionInfo = async <T>(endPoint: notionEndpoints): Promise<T> => {
  let response = await fetch(`./.netlify/functions${endPoint}`);
  let res: T = await response.json();

  return res;
};

interface CustomRecord {
  record: HTMLDivElement;
  img: HTMLImageElement;
  src: string;
}

const createNewRecord = ({
  description,
  thumbnail_url,
  title,
  watermark,
  project_url,
}: Record): CustomRecord => {
  const record = document.createElement("div");
  record.classList.add("work");
  record.setAttribute("data-aos", "fade-up");

  const thumbnail_img = new Image();
  thumbnail_img.src = "./assets/img/placeholder.png";
  thumbnail_img.setAttribute("data-aos", "fade-up");
  thumbnail_img.setAttribute("data-aos-delay", "100");
  thumbnail_img.className = "work-img";
  thumbnail_img.alt = "thumbnail";

  const template = `
    <div class="work-container">
        <div class="work-details">
            <h1 class="watermark">${watermark}</h1>
            <div class="details-content">
                <h3 class="work-title">${title}</h3>
                <p class="work-descr">
                    ${description}
                </p>
                <a href="${project_url}" class="view-work">View work</a>
            </div>
        </div>
        <img src="assets/img/icons8-coderwall.svg" alt="icon" class="work-icon">
    </div>
  `;

  record.innerHTML = template;
  record.append(thumbnail_img);

  return { record, img: thumbnail_img, src: thumbnail_url };
};

const renderRecords = (records: Record[], rootElement: HTMLElement): void => {
  const allImages: HTMLImageElement[] = [];
  const urlsToFetch: string[] = [];

  records.forEach((record: Record) => {
    const recordElement = createNewRecord(record);
    allImages.push(recordElement.img);
    urlsToFetch.push(recordElement.src);

    rootElement.append(recordElement.record);
  });

  let index = 0;

  Preload(urlsToFetch, {
    order: Order.InOrder,
    inBackground: true,
    toBase64: true,
    onSingleImageComplete: (base64: string) => {
      allImages[index].src = base64;
      index++;
    },
  });
};

export { fetchNotionInfo, renderRecords };
