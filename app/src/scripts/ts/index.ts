import * as AOS from "aos";
import { cursorSetup } from "./cursorSetup";
import splitbee from "@splitbee/web";

// Notion API helpers
import { fetchNotionInfo, renderRecords } from "./notion/index";
import { HeroImage, Record } from "./notion/notionFetchInterfaces";
import { notionEndpoints } from "./notion/notionEndpoints";

// setting up the software for tracking website traffic
splitbee.init();

(async () => {
  try {
    const heroImage = document.querySelector(".bg-img")!;
    const heroImageFetched = await fetchNotionInfo<HeroImage>(
      notionEndpoints.HERO_IMAGE
    );
    const heroImageUrl = heroImageFetched.url;
    setBackgroundImg(heroImage, heroImageUrl);
  } catch (e) {}

  try {
    const fetchedRecords = await fetchNotionInfo<Record[]>(
      notionEndpoints.WORKS
    );
    renderRecords(fetchedRecords, document.querySelector(".works")!);
  } catch (error) {
    document.querySelector(".works")?.remove();

    const errorDiv = Array.from(
      document.getElementsByClassName(
        "fetch-error"
      ) as HTMLCollectionOf<HTMLElement>
    )[0];

    errorDiv.style.display = "block";
  }
})();

setBackgroundImgtoAll();
cursorSetup(0.1);

let bars = $(".burger-menu"),
  autoScroll = false;

const hidePreloader = (): void => {
  setTimeout(() => {
    $(".preloader").animate({ opacity: 0 }, 400, () => {
      $(".preloader").hide();
    });
  }, 1500);
};

const setMainWrapperHeight = (): void => {
  const h = $(".about-wrapper .container").height();
  if (h) {
    $(".about-wrapper").height(h);
  }
};

const initAnimations = (): void => {
  setTimeout(() => {
    AOS.init({
      easing: "ease", // default easing for AOS animations
      duration: 1000, // values from 0 to 3000, with step 50ms,
      once: true,
      disable: (): boolean => {
        return !(($(document).width() as number) >= 1024);
      },
    });
    showPageOverflowOnYAxis();
  }, 1000);
};

const showPageOverflowOnYAxis = (): void => {
  let screen = document.getElementById("screen")!;
  screen.style.height = "inherit";
};

// // Hiding prelaoder and initializing AOS animations
$(window).on("load", () => {
  hidePreloader();
  setMainWrapperHeight();
  initAnimations();
});

// Top navigation changes it's background on scroll on mobile devices
$(window).resize(() => {
  if (autoScroll) {
    setTimeout(showNavOnResize, 500);
  } else {
    showNavOnResize();
  }

  setMainWrapperHeight();
});

$(window).scroll(() => {
  if (autoScroll) {
    setTimeout(showNav, 2000);
    autoScroll = false;
  } else {
    showNav();
  }
});

function showNav() {
  if (($(document).width() as number) <= 816) {
    if (($(document).scrollTop() as number) > 10) {
      $(".top-menu").addClass("scrolled");
    } else {
      $(".top-menu").removeClass("scrolled");
    }

    if (($(document).scrollTop() as number) > 250) {
      $(".top-menu").css("border-bottom", "1px solid #f0f0f0");
    } else {
      $(".top-menu").css("border-bottom", "none");
    }
  } else {
    $(".top-menu").removeClass("scrolled");
  }
}

function showNavOnResize() {
  if (($(document).width() as number) <= 816) {
    $(".top-menu").show();
    $(window).scroll(() => {
      if (($(document).scrollTop() as number) > 10) {
        $(".top-menu").addClass("scrolled");
      } else {
        $(".top-menu").removeClass("scrolled");
      }

      if (($(document).scrollTop() as number) > 250) {
        $(".top-menu").css("border-bottom", "1px solid #f0f0f0");
      } else {
        $(".top-menu").css("border-bottom", "none");
      }
    });
  } else {
    $(".top-menu").hide();
  }
}

// Wrapping and unwrapping #mainScreen elements for responsiveness reasons
let container = $(document.createElement("div")).addClass("container"),
  container_spec = $(document.createElement("div")).addClass("container spec");

const adaptWrapperFormobile = (): void => {
  if (($(document).width() as number) < 1025) {
    $(".basic-info").wrap(container);
    $(".view-portfolio").wrap(container_spec);
  } else {
    $(".basic-info").unwrap(".container");
    $(".view-portfolio").unwrap(".container");
  }
};

adaptWrapperFormobile();

$(window).resize(() => {
  $(".basic-info").unwrap(".container");
  $(".view-portfolio").unwrap(".container");

  adaptWrapperFormobile();
});

$(".desktop-nav a").click((e) => {
  e.preventDefault();

  let attrEl = $(e.target).attr("href")!;
  let links = $(attrEl);
  if (links) {
    let top = links.offset()?.top;
    if (top) {
      $("html, body").animate(
        { scrollTop: top - 40 } as { scrollTop: number },
        700,
        () => {
          autoScroll = true;
        }
      );
    }
  }
});

// Navigational scrolling
bars.on("click", () => {
  $(".overlap").animate({ "margin-left": "0" }, 400);

  setTimeout(() => {
    $(".nav-menu-mobile").addClass("popUp");
    $(".nav-menu-mobile li").addClass("getInPlace");
  }, 150);
});

bars.click("click", () => {
  setTimeout(() => {
    $(".close-menu").addClass("open-menu");
  }, 500);
});

const animateMobileMenu = (): void => {
  setTimeout(() => {
    $(".overlap").animate({ "margin-left": "240%" }, 400);
  }, 150);

  $(".nav-menu-mobile").toggleClass("popUp");
  $(".nav-menu-mobile li").removeClass("getInPlace");
};

$(".close-menu span").click(() => {
  $(".close-menu").removeClass("open-menu");
  animateMobileMenu();
});

$(".nav-menu-mobile a").click((e) => {
  e.preventDefault();
  navigateToSection(e, 10);

  $(".close-menu").removeClass("open-menu");
  setTimeout(() => {
    animateMobileMenu();
  }, 150);
});

$(".footer-links a").click((e) => {
  if (($(document).width() as number) <= 816) {
    navigateToSection(e, 700);
  } else {
    let attrEl = $(e.target).attr("href")!;
    let links = $(attrEl);
    if (links) {
      let top = links.offset()?.top;
      if (top) {
        $("html, body").animate(
          { scrollTop: top - 40 } as { scrollTop: number },
          700,
          () => {}
        );
      }
    }
  }
});

$(".view-portfolio").click((e) => {
  e.preventDefault();
  navigateToSection(e, 700);
});

// #aboutMe section's wrapping for responsiveness reasons
// $(".about-wrapper").height($(".about-wrapper .container").height())
let currentSectionCount = "1";

$("#wrapper > section").each((index, el) => {
  $(window).scroll((e) => {
    let sections = $("#wrapper > section");
    let coordinates = sections.eq(index).offset();

    if (!sections && !coordinates) {
      return;
    }

    if (coordinates) {
      if (($(window).scrollTop() as number) >= coordinates.top) {
        let sectionId = $(el).attr("data-section");
        if (sectionId) {
          currentSectionCount = sectionId;
          $(".section-id").html("# 0" + currentSectionCount);
        }
      }
    }
  });
});

if (($(window).width() as number) >= 1024) {
  let container = document.createElement("div");
  let el = $(container).addClass("container");
  $(".aboutViewport").wrap(el);
}

function setBackgroundImgtoAll(): void {
  const images = document
    .querySelectorAll("[data-src]")
    .forEach((image: Element) => {
      const url = $(image).attr("data-src")!;
      setBackgroundImg(image, url);
    });
}

function setBackgroundImg(el: Element, url: string): void {
  $(el).css("background-image", "url(" + url + ")");
}

function navigateToSection(
  e: JQuery.ClickEvent<HTMLElement, null, HTMLElement, HTMLElement>,
  speed: number
) {
  let attrs = $(e.target).attr("href")!;
  let links = $(attrs);

  let navHeight = $(".top-menu").outerHeight();
  let padding = 0;

  if (links) {
    let outerh = links?.outerHeight() as number;
    let h = links?.height() as number;
    padding = outerh - h;
  }

  e.preventDefault();

  if (($(document).width() as number) >= 1024) navHeight = 0;
  else navHeight = $(".top-menu").outerHeight();

  $(window).resize(() => {
    if (($(document).width() as number) >= 1024) navHeight = 0;
    else navHeight = $(".top-menu").outerHeight();
  });

  let autoScroll: boolean;
  let coordinates = links.offset();

  if (links && coordinates) {
    if ($(e.target).attr("href") === "#slogan") {
      $("html, body").animate(
        { scrollTop: coordinates.top - navHeight! },
        speed,
        () => {
          autoScroll = true;
        }
      );
    } else {
      $("html, body").animate(
        {
          scrollTop: coordinates.top - padding - navHeight! / 2,
        },
        speed,
        () => {
          autoScroll = true;
        }
      );
    }
  }

  return false;
}
