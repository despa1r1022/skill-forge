import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTools } from "../../hooks/useTools";
import { useSkills } from "../../hooks/useSkills";
import { ToolSelector } from "./ToolSelector";
import { SearchInput } from "../shared/SearchInput";
import { StatusBadge } from "../shared/StatusBadge";

interface SidebarProps {
  onSelectSkill?: (name: string) => void;
}

export function Sidebar({ onSelectSkill }: SidebarProps) {
  const { tools, selectedTool, setSelectedTool } = useTools();
  const { skills, loading } = useSkills(selectedTool);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { name: activeSkill } = useParams();

  const filtered = skills.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (name: string) => {
    if (onSelectSkill) {
      onSelectSkill(name);
    } else {
      navigate(`/skills/${name}`);
    }
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-3 border-b border-slate-200">
        <ToolSelector
          tools={tools}
          selected={selectedTool}
          onChange={setSelectedTool}
        />
      </div>
      <div className="p-3 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Skills ({filtered.length})
          </span>
          <button
            onClick={() => navigate("/skills/create")}
            className="text-xs px-2 py-1 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
          >
            + New
          </button>
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Search skills..." />
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-sm text-slate-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-sm text-slate-400">
            {search ? "No matching skills" : "No skills found"}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((skill) => (
              <li
                key={`${skill.tool_id}-${skill.name}`}
                onClick={() => handleSelect(skill.name)}
                className={`px-3 py-2.5 cursor-pointer transition-colors hover:bg-slate-50 ${
                  activeSkill === skill.name ? "bg-primary-50 border-l-2 border-primary-500" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700 truncate flex-1">
                    {skill.name}
                  </span>
                  <StatusBadge enabled={skill.enabled} />
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {skill.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
