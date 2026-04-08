import { getAllSections } from "@/app/actions/sections/getSections";
import SectionsClient from "@/components/editor/SectionsClient";

export default async function SectionsPage() {
  const sections = await getAllSections();

  return <SectionsClient sections={sections} />;
}
