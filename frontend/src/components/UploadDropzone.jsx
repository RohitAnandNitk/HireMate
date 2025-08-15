import React, { useCallback, useMemo, useRef, useState } from 'react'

const BYTES_IN_MB = 1024 * 1024
const MAX_SIZE_MB = 10
const SUPPORTED = ['pdf','doc','docx','txt','rtf']

function fmtBytes(n) {
	if (n < 1024) return `${n} B`
	if (n < 1024 * 1024) return `${(n/1024).toFixed(1)} KB`
	return `${(n/1024/1024).toFixed(1)} MB`
}

function isAllowed(file) {
	const ext = (file.name.split('.').pop() || '').toLowerCase()
	return SUPPORTED.includes(ext) && file.size <= MAX_SIZE_MB * BYTES_IN_MB
}

async function readAllEntries(reader) {
	const out = []
	while (true) {
		const batch = await new Promise((res) => reader.readEntries(res))
		if (!batch.length) break
		out.push(...batch)
	}
	return out
}

async function walk(entry, base = '') {
	const files = []
	if (entry.isFile) {
		const file = await new Promise((resolve, reject) => entry.file(resolve, reject))
		file.webkitRelativePath = file.webkitRelativePath || `${base}${file.name}`
		files.push(file)
	}
	if (entry.isDirectory) {
		const reader = entry.createReader()
		const entries = await readAllEntries(reader)
		for (const e of entries) {
			const nested = await walk(e, `${base}${entry.name}/`)
			files.push(...nested)
		}
	}
	return files
}

const UploadDropzone = ({ onAddFiles }) => {
	const fileInputRef = useRef(null)
	const folderInputRef = useRef(null)
	const [dragging, setDragging] = useState(false)

	const handleFiles = useCallback((list) => {
		const arr = Array.from(list)
		const valid = arr.filter(isAllowed)
		onAddFiles(valid)
	}, [onAddFiles])

	const onDrop = useCallback(async (e) => {
		e.preventDefault()
		setDragging(false)
		const dt = e.dataTransfer
		const collected = []
		if (dt.items && dt.items[0] && dt.items[0].webkitGetAsEntry) {
			for (const item of dt.items) {
				const entry = item.webkitGetAsEntry()
				if (!entry) continue
				const walked = await walk(entry)
				collected.push(...walked)
			}
			onAddFiles(collected.filter(isAllowed))
		} else if (dt.files) {
			handleFiles(dt.files)
		}
	}, [handleFiles, onAddFiles])

	const onDragOver = useCallback((e) => {
		e.preventDefault()
		setDragging(true)
	}, [])

	const onDragLeave = useCallback((e) => {
		if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false)
	}, [])

	const hint = useMemo(() => `Supports PDF, DOC/X, TXT, RTF up to ${MAX_SIZE_MB}MB each`, [])

	return (
		<div
			onDrop={onDrop}
			onDragOver={onDragOver}
			onDragLeave={onDragLeave}
			className={`rounded-xl border-2 border-dashed ${dragging ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 bg-white'} p-8 transition-colors`}
		>
			<div className="flex flex-col items-center gap-3 text-center">
				<div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
					<span className="text-gray-500">☁️</span>
				</div>
				<p className="text-gray-600 text-sm">Drag and drop resume files or a folder here, or use the buttons below</p>
				<p className="text-gray-400 text-xs">{hint}</p>
				<div className="flex items-center gap-3 mt-2">
					<button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-black">Browse Files</button>
					<button onClick={() => folderInputRef.current?.click()} className="px-4 py-2 rounded-md bg-white border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">Choose Folder</button>
				</div>
				<input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files || [])} />
				<input ref={folderInputRef} type="file" multiple /* @ts-ignore */ webkitdirectory="" /* @ts-ignore */ directory="" className="hidden" onChange={(e) => handleFiles(e.target.files || [])} />
			</div>
		</div>
	)
}

export default UploadDropzone

