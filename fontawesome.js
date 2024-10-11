import { library, dom } from "@fortawesome/fontawesome-svg-core";

import {
    faStar,
    faHeart,
    faCircle,
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import {
    faTelegram,
    faXTwitter,
    faRedditAlien,
    faYoutube,
    faGithubAlt,
} from "@fortawesome/free-brands-svg-icons";

export default function initFontAwesome() {
    library.add(
        faStar,
        faHeart,
        faCircle,
        faChevronLeft,
        faChevronRight,

        faTelegram,
        faXTwitter,
        faRedditAlien,
        faYoutube,
        faGithubAlt
    );

    dom.watch();
}
