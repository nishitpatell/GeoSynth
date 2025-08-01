import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import earthTexture from "/earth_daymap.png"; // You'll need this texture

export default function Globe() {
  const texture = useLoader(TextureLoader, earthTexture);

  return (
    <mesh>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
