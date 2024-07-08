import { SubmissionType } from '@prisma/client'
import * as yup from 'yup'

const SUBMISSION_TYPES = Object.values(SubmissionType)

export const fileUploadSchema = yup.object({
	submissionType: yup.mixed<typeof SUBMISSION_TYPES[number]>().oneOf([...SUBMISSION_TYPES], 'Invalid option!').required(),
	uploadOption: yup.string().default('zip'),
	zip: yup.mixed().when('uploadOption', {
		is: 'zip',
		then: yup
			.mixed<FileList>()
			.test('required', 'File is required', f => {
				return !!f && f.length > 0
			})
			.test('is-valid-type', 'Not a valid file format', f => {
				return f?.[0]?.type === 'application/x-zip-compressed'
			})
	}),
	imageUpload: yup.mixed().when(['submissionType', 'uploadOption'], {
		is: (submissionType: any, uploadOption: any) => 
			(submissionType === 'ALWAN' || submissionType === 'MANUAL') && uploadOption === 'imageUpload',
		then: yup
			.mixed<FileList>()
			.test('required', 'Must have at least 30 images', f => {
				return !!f && f.length >= 30
			})
			.test('limit', 'Cannot exceed 50 images', f => {
				return !!f && f.length <= 50
			})
			.test('is-valid-type', 'Invalid file type!', f => {
				if (!f) return false

				for (let i = 0; i < f.length; i++) {
					if (!f[i].type.startsWith('image/')) {
						return false
					}
				}

				return true
			})
	}),
	alwanDataForm: yup.mixed().when('submissionType', {
		is: 'ALWAN',
		then: yup
			.mixed<FileList>()
			.test('required', 'File is required', f => {
				return !!f && f.length > 0
			})
			.test('is-valid-type', 'Not a valid file format', f => {
				return f?.[0]?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || f?.[0]?.type === 'application/vnd.ms-excel'
			})
	}),
	coralDataSheet: yup.mixed().when('submissionType', {
		is: 'MANUAL',
		then: yup
			.mixed<FileList>()
			.test('required', 'File is required', f => {
				return !!f && f.length > 0
			})
			.test('is-valid-type', 'Invalid file type!', f => {
				return !!f?.[0]?.type.startsWith('image/')
			})
	}),
	surveyGuides: yup.mixed().when('submissionType', {
		is: 'MANUAL',
		then: yup
			.mixed<FileList>()
			.test('required', 'File is required', f => {
				return !!f && f.length > 0
			})
			.test('limit', 'Cannot exceed 12 images', f => {
				return !!f && f.length <= 12
			})
			.test('is-valid-type', 'Invalid file type!', f => {
				if (!f) return false

				for (let i = 0; i < f.length; i++) {
					if (!f[i].type.startsWith('image/')) {
						return false
					}
				}

				return true
			})
	}),
}).required()

export type IFileUploads = yup.InferType<typeof fileUploadSchema>