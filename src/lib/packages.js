export default [
    {
        channel: "Scoop",
        official: true,
        commands: [
            "scoop install git",
            "scoop bucket add redasm https://github.com/redasm-dev/scoop-redasm",
            "scoop install redasm",
        ]
    },
    {
        channel: "Arch Linux (AUR)",
        official: true,
        commands: [
            "Replace `yay` with your AUR helper.",
            "# beta",
            "yay -S redasm-beta",
            "# nightly",
            "yay -S redasm-git",
        ],
    },
    {
        channel: "Pentoo",
        commands: [
            "Split in various packages:",
            "- libredasm",
            "- redasm-gui",
            "- redasm-loaders",
            "- redasm-processors",
            "- redasm-analyzers",
            "- redasm-commands",
            "- redasm-kb",
        ]
    }
]
