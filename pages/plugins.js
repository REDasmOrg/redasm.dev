const LOADERS = [
    { name: "Portable Executable (PE)", language: "C++", status: "Stable" },
    { name: "ELF Executable", language: "C++", status: "Stable" },
    { name: "PSX Executable", language: "C++", status: "Stable" },
    { name: "PSX Bios", language: "C++", status: "Stable" },
    { name: "XBox1 Executable (XBE)", language: "C++", status: "Stable" },
    { name: "ESP32 Roms", language: "C++", status: "Experimental" },
    { name: "Android DEX", language: "C++", status: "Stable" },
];

const ASSEMBLERS = [
    { name: "x86 and X86_64", notes: "Zydis backend", url: "https://zydis.re" },
    { name: "MIPS" },
    { name: "ARM64", notes: "Capstone Engine backend", url: "https://www.capstone-engine.org" },
    { name: "CHIP-8" },
    { name: "XTensa" },
    { name: "Dalvik" },
];

export default {
    title: "Features",

    delegate: function(app, template) {
        const tabloaders = template.querySelector("tab-panel[title='Loaders']");
        const tabassemblers = template.querySelector("tab-panel[title='Assemblers']");

        tabloaders.appendChild(app.createTable({
            class: "w-full",
            header: ["Name", "Language", "Status"],
            rows: LOADERS,
            rowclass: "text-center",

            delegate: x => {
                const isstable = x.status === "Stable";

                return /*html*/`
                    <td>${x.name}</td>
                    <td>${x.language}</td>
                    <td class="text-center">
                        <span class=" p-1 rounded-md font-bold uppercase text-xs text-background ${isstable ? 'bg-success' : 'bg-warning'}">
                            ${x.status}
                        </span>
                    </td>
                `;
            }
        }));

        tabassemblers.appendChild(app.createTable({
            class: "w-full",
            header: ["Name", "Notes"],
            rows: ASSEMBLERS,
            rowclass: "text-center",

            delegate: x => {
                return /*html*/`
                    <td>${x.name}</td>
                    <td>
                    ${x.url ? `<a target="_blank" href="${x.url}">${x.notes}</a>` :
                        (x.notes || "")}
                    </td>
                `;
            }
        }));
    },

    template: /*html*/`
        <tab-container>
            <tab-panel title="Loaders">
            </tab-panel>
            <tab-panel title="Assemblers">
            </tab-panel>
        </tab-container>
        <p class="mt-8">
            <span class="font-bold">REDasm is actively under development</span> and not all features may be
            available yet. 
        </p>
        <p>
            Have a suggestion or an idea? Feel free to request a feature or join the discussion
            <a href="https://github.com/REDasmOrg/REDasm/issues">by opening an issue on GitHub</a>!
        </p>
    `
};
