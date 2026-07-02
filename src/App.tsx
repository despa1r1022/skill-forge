import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToolsProvider } from "./hooks/useToolsContext";
import { Layout } from "./components/layout/Layout";
import { SkillList } from "./components/skill/SkillList";
import { SkillDetail } from "./components/skill/SkillDetail";
import { SkillEditor } from "./components/skill/SkillEditor";
import { CreateWizard } from "./components/skill/CreateWizard";

export function App() {
  return (
    <BrowserRouter>
      <ToolsProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<SkillList />} />
            <Route path="/skills" element={<SkillList />} />
            <Route path="/skills/:name" element={<SkillDetail />} />
            <Route path="/skills/:name/edit" element={<SkillEditor />} />
            <Route path="/skills/create" element={<CreateWizard />} />
          </Route>
        </Routes>
      </ToolsProvider>
    </BrowserRouter>
  );
}
