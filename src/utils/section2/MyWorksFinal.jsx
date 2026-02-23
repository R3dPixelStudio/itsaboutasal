import { useMemo } from "react";
import { booksConfigMap, SHELF_LAYOUTS, SHELF_GROUP_LAYOUTS } from '../Configs.js';
import Book from './Book.jsx';
import { BookShelf } from './Bookshelf.jsx'; 
import { useBookStore } from '../store';

export default function MyWorks(props) {
  const { assetMap, ...restProps } = props;
  const device = useBookStore((state) => state.deviceType);
  const currentSection = useBookStore((state) => state.currentSection);

  const booksConfig = useMemo(() => booksConfigMap[device] || [], [device]);
  const shelfConfig = useMemo(() => SHELF_LAYOUTS[device] || {}, [device]);
  const groupConfig = useMemo(() => SHELF_GROUP_LAYOUTS[device] || {}, [device]);

  // LOGIC: We are ALWAYS "High Quality" regarding structure (meshes exist).
  // But we use this flag to sleep calculations when far away.
  const isSectionActive = currentSection === 1; 

  return (
    <group {...restProps}>
      <group 
        position={groupConfig.position} 
        scale={[groupConfig.scale || 1, groupConfig.scale || 1, groupConfig.scale || 1]}
      >
        <BookShelf position={shelfConfig.position} scale={shelfConfig.scale} assetMap={assetMap} />

        {booksConfig.map((cfg) => (
          <Book 
            key={cfg.id} 
            config={cfg} 
            assetMap={assetMap} 
            // We pass this to tell the book: "You exist, but go to sleep if false"
            isSectionActive={isSectionActive} 
          />
        ))}
      </group>
    </group>
  );
}