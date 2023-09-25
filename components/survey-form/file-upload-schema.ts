import { SubmissionType } from '@prisma/client'
import * as yup from 'yup'

const SUBMISSION_TYPES = Object.values(SubmissionType)

export const fileUploadSchema = yup.object({
	submissionType: yup.mixed<typeof SUBMISSION_TYPES[number]>().oneOf([...SUBMISSION_TYPES], 'Invalid option!').required(),
	zip: yup
		.mixed<FileList>()
		.test('required', 'File is required', f => {
			return !!f && f.length > 0
		})
		.test('is-valid-type', 'Not a valid file format', f => {
			return f?.[0]?.type === 'application/x-zip-compressed'
		}),
	alwanDataForm: yup.mixed().when('mode', {
		is: 'ALWAN',
		then: yup
			.mixed<FileList>()
			.test('required', 'File is required', f => {
				return !!f && f.length > 0
			})
			.test('is-valid-type', 'Not a valid file format', f => {
				return f?.[0]?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			})
	}),
	coralDataSheet: yup.mixed().when('mode', {
		is: 'MANUAL',
		then: yup
			.mixed<FileList>()
			.test('required', 'File is required', f => {
				return !!f && f.length > 0
			})
	}),
	surveyGuides: yup.mixed().when('mode', {
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
