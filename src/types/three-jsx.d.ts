import { Object3DNode } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
      spotLight: Object3DNode<THREE.SpotLight, typeof THREE.SpotLight>;
      group: Object3DNode<THREE.Group, typeof THREE.Group>;
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
      boxGeometry: Object3DNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
      meshStandardMaterial: Object3DNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
      meshBasicMaterial: Object3DNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>;
      planeGeometry: Object3DNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;
    }
  }
}
