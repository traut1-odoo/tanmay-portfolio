"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import "./travel-story.css";

const motionQuery = "(min-width: 768px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getMotion = () => window.matchMedia(motionQuery).matches;
const getServerMotion = () => false;

export function TravelStory() {
  const flightRef = useRef<HTMLElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const motionEnabled = useSyncExternalStore(subscribeMotion, getMotion, getServerMotion);
  const { scrollYProgress: flightProgress } = useScroll({ target: flightRef, offset: ["start end", "end start"] });
  const { scrollYProgress: photoProgress } = useScroll({ target: photosRef, offset: ["start end", "end start"] });
  const opening = useTransform(flightProgress, [0.05, 0.48], ["inset(11% 18% 11% 18%)", "inset(0% 0% 0% 0%)"]);
  const flightScale = useTransform(flightProgress, [0, 1], [1.16, 1]);
  const flightY = useTransform(flightProgress, [0, 1], ["-5%", "5%"]);
  const tahoeY = useTransform(photoProgress, [0, 1], [65, -55]);
  const auroraY = useTransform(photoProgress, [0, 1], [110, -90]);
  const tahoeScale = useTransform(photoProgress, [0, 1], [1.08, 1]);
  const auroraScale = useTransform(photoProgress, [0, 1], [1.14, 1]);

  return (
    <section id="away-from-the-desk" className="travel-story" aria-labelledby="travel-story-title">
      <div className="travel-story-heading">
        <p className="travel-story-eyebrow">Away from the desk</p>
        <h2 id="travel-story-title">Still <span>exploring.</span></h2>
      </div>

      <figure ref={flightRef} className="travel-flight">
        <motion.div className="travel-flight-window" style={{ clipPath: motionEnabled ? opening : "none" }}>
          <motion.div className="travel-flight-image" style={{ scale: motionEnabled ? flightScale : 1, y: motionEnabled ? flightY : 0 }}>
            <Image
              src="/images/lifestyle/skydiving.jpg"
              alt="Tanmay in freefall during a tandem skydive, with clouds and the landscape below"
              fill
              sizes="100vw"
              className="travel-flight-photo"
            />
          </motion.div>
        </motion.div>
        <figcaption><span>Sometimes, a different perspective.</span><span>Skydiving</span></figcaption>
      </figure>

      <div ref={photosRef} className="travel-photographs">
        <motion.figure className="travel-photo travel-photo-tahoe" style={{ y: motionEnabled ? tahoeY : 0 }}>
          <div className="travel-portrait-window">
            <motion.div className="travel-portrait-image" style={{ scale: motionEnabled ? tahoeScale : 1 }}>
              <Image src="/images/lifestyle/tahoe.jpg" alt="Tanmay beside clear blue water and mountains at Lake Tahoe" fill sizes="(max-width: 767px) 46vw, 32vw" className="travel-tahoe-image" />
            </motion.div>
          </div>
          <figcaption>Lake Tahoe</figcaption>
        </motion.figure>
        <motion.figure className="travel-photo travel-photo-aurora" style={{ y: motionEnabled ? auroraY : 0 }}>
          <div className="travel-portrait-window">
            <motion.div className="travel-portrait-image" style={{ scale: motionEnabled ? auroraScale : 1 }}>
              <Image src="/images/lifestyle/northern-lights.jpg" alt="Tanmay looking up at green northern lights across a starry sky" fill sizes="(max-width: 767px) 46vw, 28vw" className="travel-aurora-image" />
            </motion.div>
          </div>
          <figcaption>Northern lights</figcaption>
        </motion.figure>
      </div>

      <div className="travel-story-links">
        <Link href="/about">A little more about me <ArrowUpRight size={17} aria-hidden="true" /></Link>
        <a href="/videos/reel.mp4"><Play size={14} aria-hidden="true" /> Watch the travel reel</a>
      </div>
    </section>
  );
}
