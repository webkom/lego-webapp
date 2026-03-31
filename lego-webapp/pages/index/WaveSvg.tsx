type WaveSvgProps = {
  className?: string;
  type: 'top' | 'mid' | 'btm';
};

export default function WaveSvg({ className, type }: WaveSvgProps) {
  if (type === 'top') {
    return (
      <svg
        className={className}
        height="119pt"
        preserveAspectRatio="none"
        version="1.0"
        viewBox="0 0 1920 119"
        width="1920pt"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="none" transform="translate(0,119) scale(0.1,-0.1)">
          <path d="M0 592 l0 -592 9600 0 9600 0 0 592 0 591 -202 -7 c-537 -18 -1061 -71 -2398 -241 -1857 -236 -2519 -295 -3321 -295 -808 0 -1384 59 -2769 285 -869 141 -1176 183 -1605 220 -656 55 -1173 43 -1765 -41 -369 -53 -719 -126 -1485 -309 -569 -135 -908 -201 -1260 -242 -190 -22 -747 -25 -930 -5 -402 44 -657 99 -1315 282 -886 248 -1318 324 -1952 346 l-198 7 0 -591z" />
        </g>
      </svg>
    );
  } else if (type === 'mid') {
    return (
      <svg
        className={className}
        height="167pt"
        preserveAspectRatio="none"
        version="1.0"
        viewBox="0 0 1920 167"
        width="1920pt"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="none" transform="translate(0,167) scale(0.1,-0.1)">
          <path d="M0 832 l0 -832 9600 0 9600 0 0 830 0 830 -67 0 c-295 -1 -926 -51 -1513 -121 -838 -100 -1519 -203 -3560 -544 -2521 -420 -2893 -466 -3240 -400 -269 51 -484 136 -1085 428 -639 309 -931 426 -1311 521 -322 82 -564 111 -919 110 -287 0 -425 -10 -703 -50 -427 -61 -747 -144 -1477 -384 -1010 -332 -1357 -402 -1915 -387 -525 15 -920 108 -1615 383 -853 337 -1161 420 -1637 440 l-158 7 0 -831z" />
        </g>
      </svg>
    );
  } else {
    return (
      <svg
        className={className}
        height="219pt"
        preserveAspectRatio="none"
        version="1.0"
        viewBox="0 0 1920 219"
        width="1920pt"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="none" transform="translate(0,219) scale(0.1,-0.1)">
          <path d="M0 1096 l0 -1096 9600 0 9600 0 0 1096 0 1096 -122 -7 c-556 -30 -1086 -128 -2168 -401 -1025 -260 -1253 -317 -1475 -367 -1540 -354 -2283 -397 -3300 -192 -432 88 -775 185 -1615 460 -990 324 -1443 434 -2005 486 -169 16 -558 16 -710 0 -400 -42 -789 -143 -1235 -322 -228 -91 -439 -186 -900 -406 -619 -296 -890 -405 -1197 -482 -207 -52 -286 -63 -505 -68 -302 -8 -490 19 -768 109 -264 85 -506 202 -1016 489 -350 196 -600 325 -794 406 -426 180 -796 265 -1257 288 l-133 7 0 -1096z" />
        </g>
      </svg>
    );
  }
}
