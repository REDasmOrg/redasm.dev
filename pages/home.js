const FEATURES_LIST = [
    {
        image: "/showcase/redasm_1.png",

        features: [
            {
                icon: "fas fa-list",
                title: "INTERACTIVE LISTING",
                text: "A fully custom component that behaves like a classic text editor, allowing seamless navigation through disassembled code"
            },
            {
                icon: "fas fa-sitemap",
                title: "GRAPHING SUPPORT",
                text: "Automatically generated graphs during analysis provide valuable insights for identifying code paths and control flow"
            },
            {
                icon: "fas fa-dumbbell",
                title: "BINARY LIFTING",
                text: "An internal virtual instruction set (RDIL) converts machine code into a higher-level representation for easier understanding"
            },
        ]
    },
    {
        image: "/showcase/redasm_2.png",

        features: [
            {
                icon: "fas fa-window-restore",
                title: "NATIVE GUI",
                text: "A cross-platform graphical interface, written in modern C++ using the Qt6 framework, ensures a smooth user experience"
            },
            {
                icon: "fas fa-cubes-stacked",
                title: "C/C++ AND PYTHON API",
                text: "First-class support for C/C++ and Python, enabling developers to extend and integrate REDasm into their workflows"
            },
            {
                icon: "fas fa-heart",
                title: "OPEN SOURCE",
                text: "Licensed under the GNU GPL3, REDasm is free and open-source, encouraging community collaboration and contributions"
            }
        ]
    }
];

export default {
    delegate: function(app, template) {
        const c = template.querySelector("#home__features");

        FEATURES_LIST.forEach((f, i) => {
            const H = /*html*/ `
                <div class="flex ${i % 2 ? "flex-row-reverse" : ""} items-center gap-x-3 mt-6">
                    <div class="flex-1">
                        <ul class="space-y-5">
                            ${f.features.map(x => {
                return /*html*/ `
                                    <li class="flex gap-x-3 items-center ">
                                        <div>
                                            <i class="${x.icon} fa-fw fa-2xl"></i>
                                        </div>
                                        <div class="flex-1">
                                            <h3 class="font-bold text-lg">${x.title}</h3>
                                            <p>${x.text}</p>
                                        </div>
                                    </li>
                                `;
            }).join("")}
                        </ul>
                    </div>
                    <div>
                        <img class="object-fit w-[500px]" src="${f.image}">
                    </div>
                </div>
                `;

            c.appendChild(app.parseHTML(H));
        });
    },

    template: /*html*/`
        <article>
            <div class="flex gap-x-4">
                <div>
                    <img alt="logo" src="/logo.png">
                </div>
                <div>
                    <p>
                        REDasm is a user-friendly, modern and cross-platform disassembler 
                        designed for both hobbyists and professional reverse engineers. 
                    </p>
                    <p>
                        Featuring an intuitive interface and a flexible plugin system, REDasm makes it easy to analyze 
                        binary files and transform machine code into readable assembly language.
                    </p>
                    <p class="text-right italic mt-3">
                       Check the list of supported plugins
                       <a data-navigation href="/plugins">here</a> and the features list below!
                    </p>
                </div>
            </div>
        </article>
        <div id="home__features"></div>
    `
};
