// src/utils/HtmlContent.jsx
import { useBookStore } from './store';
import InteractiveUI from './section2/InteractiveUI.jsx';
import { ContactSection } from './section3/ContactSection';
import { Section4 } from './section4/Section4';
import Section2UI from './section2/Section2UI.jsx';
import MobileSection2 from './section2/MobileSection2.jsx';
import { UI_LAYOUT_CLASSES } from './Configs';
import { HtmlSection } from './HtmlSection';

export default function HtmlContent() {
  const { bookState, deviceType, currentSection } = useBookStore();
  const isBookInteractive = bookState === 'INTERACTIVE';

  const section2LayoutClass = UI_LAYOUT_CLASSES[deviceType]?.section2 || 'w-full h-full ';

  return (
    <>
      <HtmlSection pageIndex={0} currentSection={currentSection} className="flex justify-center items-center relative">
         
      </HtmlSection>

      <HtmlSection pageIndex={1} className={section2LayoutClass} currentSection={currentSection}>
        {deviceType === 'mobile' ? (
          <MobileSection2 />
        ) : (
          <>
            <Section2UI />
            {isBookInteractive && <InteractiveUI />}
          </>
        )}
      </HtmlSection>

      <HtmlSection pageIndex={2} currentSection={currentSection}>
        <ContactSection />
      </HtmlSection>

      <HtmlSection pageIndex={3} currentSection={currentSection}>
        <Section4 />
      </HtmlSection>
    </>
  );
}