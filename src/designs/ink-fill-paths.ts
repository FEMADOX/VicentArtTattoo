export type InkFillPattern = {
  region: string
  paths: readonly string[]
  strokeWidth: number
}

// shortcut: traced regions include a skin margin; use pixel masks for skin-only effects.
// Bands overlap and extend to each silhouette edge; the region clips the passes.
export const gorillaFill: InkFillPattern = {
  region: 'M 660 300 L 715 300 L 795 332 L 912 343 L 960 408 L 1008 425 L 1008 588 L 1058 700 L 1077 845 L 1077 940 L 1017 995 L 965 1065 L 1003 1112 L 1003 1165 L 950 1195 L 965 1320 L 957 1510 L 905 1556 L 725 1585 L 500 1578 L 380 1545 L 303 1445 L 225 1390 L 173 1285 L 125 1175 L 88 1070 L 55 940 L 50 820 L 42 680 L 60 585 L 108 500 L 206 413 L 321 365 L 450 347 L 530 315 L 620 320 Z',
  strokeWidth: 72,
  paths: [
    'M 507 300 H 775',
    'M 934 348 H 304',
    'M 198 396 H 994',
    'M 1008 444 H 144',
    'M 98 492 H 1008',
    'M 1008 540 H 71',
    'M 54 588 H 1019',
    'M 1041 636 H 45',
    'M 42 684 H 1060',
    'M 1066 732 H 43',
    'M 46 780 H 1072',
    'M 1077 828 H 49',
    'M 51 876 H 1077',
    'M 1077 924 H 53',
    'M 57 972 H 1069',
    'M 1017 1020 H 69',
    'M 81 1068 H 987',
    'M 1003 1116 H 95',
    'M 112 1164 H 1003',
    'M 963 1212 H 130',
    'M 151 1260 H 961',
    'M 965 1308 H 172',
    'M 196 1356 H 965',
    'M 963 1404 H 220',
    'M 278 1452 H 961',
    'M 959 1500 H 326',
    'M 363 1548 H 942',
    'M 806 1596 H 478'
  ]
}

export const owlFill: InkFillPattern = {
  region: 'M 725 278 L 777 280 L 792 352 L 807 470 L 830 552 L 845 663 L 850 765 L 839 843 L 800 905 L 738 939 L 685 968 L 604 985 L 509 1000 L 409 1010 L 333 998 L 287 963 L 279 914 L 251 868 L 229 805 L 212 738 L 205 670 L 240 590 L 278 516 L 303 449 L 335 392 L 380 355 L 468 331 L 570 311 L 654 291 Z',
  strokeWidth: 54,
  paths: [
    'M 633 278 H 781',
    'M 788 314 H 464',
    'M 364 350 H 795',
    'M 799 386 H 328',
    'M 308 422 H 804',
    'M 809 458 H 292',
    'M 279 494 H 819',
    'M 829 530 H 261',
    'M 243 566 H 835',
    'M 840 602 H 226',
    'M 211 638 H 845',
    'M 847 674 H 205',
    'M 207 710 H 849',
    'M 850 746 H 210',
    'M 218 782 H 850',
    'M 846 818 H 227',
    'M 239 854 H 840',
    'M 821 890 H 253',
    'M 275 926 H 795',
    'M 729 962 H 283',
    'M 309 998 H 628'
  ]
}
