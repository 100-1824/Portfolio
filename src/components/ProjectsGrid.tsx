'use client';

import { motion } from 'framer-motion';
import { staggerContainer } from '@/lib/animations';
import ProjectCard from './ProjectCard';
import { Project } from '@/data';

interface ProjectsGridProps {
  projects: Project[];
  /** Key that triggers re-stagger animation when active filter changes */
  filterKey: string;
}

export default function ProjectsGrid({ projects, filterKey }: ProjectsGridProps) {
  return (
    <motion.div
      key={filterKey}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </motion.div>
  );
}
