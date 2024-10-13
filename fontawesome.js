import { library, dom } from "@fortawesome/fontawesome-svg-core";

import {
    faStar,
    faList,
    faSitemap,
    faWindowRestore,
    faCubesStacked,
    faDumbbell,
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
} from "@fortawesome/free-brands-svg-icons";

export default function initFontAwesome() {
    library.add(
        faStar,
        faList,
        faSitemap,
        faWindowRestore,
        faCubesStacked,
        faDumbbell,
        faHeart,
        faCircle,
        faChevronLeft,
        faChevronRight,

        faTelegram,
        faXTwitter,
        faRedditAlien,
        faYoutube,
    );

    dom.watch();
}
