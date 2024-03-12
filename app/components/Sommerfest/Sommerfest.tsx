import { Image } from 'app/components/Image';

function Sommerfest({ src, className }: { src: string; className: string }) {
  const now = new Date();
  const start = new Date('2024-02-20T12:00:00');
  const end = new Date('2024-03-22T12:00:00');
  if (now < start || now > end) {
    return <></>;
  }
  return <Image src={src} className={className} alt="Sommerfest" />;
}

export default Sommerfest;
