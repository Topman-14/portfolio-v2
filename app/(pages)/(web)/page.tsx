import SplinePlayer from "@/components/custom/spline";

export default function Home() {
  return (
   <section>
    <SplinePlayer scene="/3d/hero.splinecode" draggable className="h-screen bg-black" zoom={9} />

    <div className="container mx-auto bg-black h-screen"></div>
   </section>
  );
}
