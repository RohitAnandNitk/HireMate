import React, { useCallback, useState } from 'react'
import UploadDropzone from './UploadDropzone'
import FileList from './FileList'
import SkillFilter from './SkillFilter'
import StatsCards from './StatsCards'

const Dashboard = () => {
  const [files, setFiles] = useState([])
  const [skills, setSkills] = useState(['JavaScript','React','Node.js'])

  const onAddFiles = useCallback((newFiles) => {
    const existing = new Set(files.map(f => `${f.webkitRelativePath||f.name}|${f.size}`))
    const toAdd = newFiles.filter(f => !existing.has(`${f.webkitRelativePath||f.name}|${f.size}`))
    if (toAdd.length) setFiles(prev => [...prev, ...toAdd])
  }, [files])

  const onRemove = useCallback((idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx))
  }, [])

  return (
    <>
      <UploadDropzone onAddFiles={onAddFiles} />
      <FileList files={files} onRemove={onRemove} />
      <SkillFilter skills={skills} setSkills={setSkills} />
      <StatsCards />
    </>
  )
}

export default Dashboard
