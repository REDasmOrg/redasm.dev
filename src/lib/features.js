export default {
    tiers: ["S", "A", "B", "C", "D"],

    tier_details: {
        S: { description: "production ready", text: "text-[#67bd61]", border: "border-[#67bd61]" },
        A: { description: "highly stable", text: "text-[#7dafff]", border: "border-[#7dafff]" },
        B: { description: "functional", text: "text-[#ffb22e]", border: "border-[#ffb22e]" },
        C: { description: "basic / stub", text: "text-[#757575]", border: "border-[#757575]" },
        D: { description: "wip / experimental", text: "text-[#ff7575]", border: "border-[#ff7575]" },
    },

    matrix: [
        {
            icon: "fa-folder-open",
            title: "loaders",

            items: [
                { text: "PE / PE32+", tier: "S" },
                { text: "ELF / ELF64", tier: "S" },
                { text: "NE (Win16)", tier: "A" },
                { text: "LE / LX (OS/2)", tier: "A" },
                { text: "PSX EXE (PS1)", tier: "A" },
                { text: "MZ (DOS)", tier: "B" },
                { text: "PSX BIOS (PS1)", tier: "B" },
                { text: "XBE (Xbox)", tier: "B" },
                { text: "ZX Spectrum (SNA, Z80, TAP)", tier: "B" },
                { text: "NES (iNES, mapper 0)", tier: "C" },
            ],
        },
        {
            icon: "fa-microchip",
            title: "processors",

            items: [
                { text: "x86 / x86_64", tier: "S" },
                { text: "MIPS", tier: "A" },
                { text: "ARM / THUMB", tier: "A" },
                { text: "ARM64", tier: "A" },
                { text: "Z80", tier: "B" },
                { text: "MOS6502", tier: "B" },
            ],
        },
        {
            icon: "fa-magnifying-glass",
            title: "other",

            items: [
                { text: "Visual Basic Analyzer", tier: "A" },
                { text: "MSVC RTTI Analyzer", tier: "D" },
                { text: "MSVC EH Analyzer", tier: "D" },
            ],
        }
    ]
};
