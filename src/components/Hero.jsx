import headerImg from "../assets/header.png"
import brainImg from "../assets/brain.png"

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        backgroundImage: `url(${headerImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto flex min-h-[95px] max-w-7xl items-start justify-between px-4 pt-2 pb-2 sm:px-6 md:min-h-[125px] md:pt-3 md:pb-2">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold leading-snug sm:text-3xl md:text-4xl">
            Connecting Intelligence <br />
            To Business Impact
          </h1>
          <p className="mt-1 text-xs text-slate-300 sm:text-sm md:text-base">
            Access our platform to explore AI solutions tailored to your business.
          </p>
        </div>

        <img
          src={brainImg}
          alt="AI brain"
          className="mt-1 w-[90px] max-w-full object-contain sm:w-[130px] md:w-[190px]"
        />
      </div>
    </section>
  )
}