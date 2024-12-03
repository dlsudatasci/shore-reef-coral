import { SurveyFormProps } from "."
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { shallow } from "zustand/shallow"
import { Survey, useSurveyStore } from "@stores/survey-store"
import { IFileUploads, fileUploadSchema } from "./file-upload-schema"
import { SubmissionType } from "@prisma/client"
import { useEffect, useState } from "react"

const storeSelector = (state: Survey) => [state.uploads, state.setUploads] as const

export function Uploads({ submitHandler, backHandler }: SurveyFormProps) {
	const [uploads, setUploads] = useSurveyStore(storeSelector, shallow)
	const { register, handleSubmit, formState: { errors }, reset, resetField } = useForm<IFileUploads>({
		resolver: yupResolver(fileUploadSchema),
		defaultValues: uploads
	})

	const handleModeChange = (newMode: SubmissionType) => {
		setMode(newMode);
        const newUploads: IFileUploads = {
            submissionType: newMode,
			uploadOption: uploadOption,
            zip: undefined,
			imageUpload: undefined,
			alwanDataForm: undefined,
            coralDataSheet: undefined,
            surveyGuides: undefined
        };
        reset(newUploads);
	};

	const [mode, setMode] = useState<SubmissionType>(SubmissionType.CPCE)
	const [uploadOption, setUploadOption] = useState<'zip' | 'imageUpload'>('zip')

	const onSubmit = handleSubmit(
		data => {
			setUploads(data)

			if ((document.activeElement as HTMLInputElement)?.value == 'BACK') {
				backHandler()
			} else {
				submitHandler()
			}
		},
		() => {
			if ((document.activeElement as HTMLInputElement)?.value == 'BACK') {
				backHandler()
			}
		}
	)

	return (
		<form id="survey-form" onSubmit={onSubmit} className="space-y-2 mb-4">
			<div className="control text-secondary bg-accent-3 rounded-md p-4 mb-3">
				<p className="label required mb-1">What are you uploading?</p>
				<div className="space-y-1 ml-2 ">
					{Object.keys(SubmissionType).map(modeKey =>
						{
							return (
								<label key={modeKey} htmlFor={modeKey} className="cursor-pointer flex items-center space-x-2">
									<input type="radio" id={modeKey} {...register('submissionType')} value={modeKey} checked={mode === modeKey} onChange={() => handleModeChange(modeKey as SubmissionType)} 
										className="text-primary"
									/>
									<span className="translate-y-0.5">{modeKey}</span>
								</label>
							)
						}
					)}
				</div>
				<p className="error text-error">{errors.submissionType?.message?.toString()}</p>
			</div>
			{mode === 'CPCE' &&
				<div className="control text-secondary bg-accent-3 rounded-md p-4 mb-3">
					<label htmlFor="zip" className="mb-1 required">ZIP file containg Excel, images, and cpc files</label>
					<input type="file" multiple id="zip" {...register('zip')} />
					<p className="error text-error">{errors.zip?.message?.toString()}</p>
				</div>
			}
			{mode === 'ALWAN' &&
				<>
					<div className="control text-secondary bg-accent-3 rounded-md p-4 !mb-3">
						<p className="label required mb-1">Coral Images Upload Option</p>
						<div className="space-y-1 ml-2">
							<label htmlFor="zip" className="cursor-pointer flex items-center space-x-2">
								<input type="radio" id="zip" {...register('uploadOption')} value="zip" checked={uploadOption === 'zip'} onChange={() => {setUploadOption('zip'); resetField('imageUpload')}} 
									className="text-primary"
								/>
								<span className="translate-y-0.5">ZIP</span>
							</label>
							<label htmlFor="imageUpload" className="cursor-pointer flex items-center space-x-2">
								<input type="radio" id="imageUpload" {...register('uploadOption')} value="imageUpload" checked={uploadOption === 'imageUpload'} onChange={() => {setUploadOption('imageUpload'); resetField('zip')}} 
									className="text-primary"
								/>
								<span className="translate-y-0.5">Image Upload</span>
							</label>
						</div>
						<p className="error text-error">{errors.uploadOption?.message?.toString()}</p>
						{uploadOption === 'zip' &&
							<div className="control text-secondary">
								<label htmlFor="zip" className="mb-1 required">ZIP file containg 30-50 Images</label>
								<input type="file" id="zip" {...register('zip')} />
								<p className="error text-error">{errors.zip?.message?.toString()}</p>
							</div>
						}
						{uploadOption === 'imageUpload' &&
							<div className="control text-secondary">
								<label htmlFor="imageUpload" className="mb-1 required">30-50 Images</label>
								<input type="file" id="imageUpload" {...register('imageUpload')} multiple />
								<p className="error text-error">{errors.imageUpload?.message?.toString()}</p>
							</div>
						}
					</div>
					<div className="control text-secondary bg-accent-3 rounded-md p-4 !mb-3">
						<label htmlFor="alwanDataForm" className="mb-1 required">ALWAN Data Form</label>
						<input type="file" id="alwanDataForm" {...register('alwanDataForm')} />
						<p className="error text-error">{errors.alwanDataForm?.message?.toString()}</p>
					</div>
				</>
			}
			{mode === 'MANUAL' &&
				<>
					<div className="control text-secondary bg-accent-3 rounded-md p-4 !mb-3">
						<p className="label required mb-1">Coral Images Upload Option</p>
						<div className="space-y-1 ml-2">
							<label htmlFor="zip" className="cursor-pointer flex items-center space-x-2">
								<input type="radio" id="zip" {...register('uploadOption')} value="zip" checked={uploadOption === 'zip'} onChange={() => {setUploadOption('zip'); resetField('imageUpload')}} 
									className="text-primary"
								/>
								<span className="translate-y-0.5">ZIP</span>
							</label>
							<label htmlFor="imageUpload" className="cursor-pointer flex items-center space-x-2">
								<input type="radio" id="imageUpload" {...register('uploadOption')} value="imageUpload" checked={uploadOption === 'imageUpload'} onChange={() => {setUploadOption('imageUpload'); resetField('zip')}} 
									className="text-primary"
								/>
								<span className="translate-y-0.5">Image Upload</span>
							</label>
						</div>
						<p className="error text-error">{errors.uploadOption?.message?.toString()}</p>
						{uploadOption === 'zip' &&
							<div className="control text-secondary">
								<label htmlFor="zip" className="mb-1 required">ZIP file containg 30-50 Images</label>
								<input type="file" id="zip" {...register('zip')} />
								<p className="error text-error">{errors.zip?.message?.toString()}</p>
							</div>
						}
						{uploadOption === 'imageUpload' &&
							<div className="control text-secondary">
								<label htmlFor="imageUpload" className="mb-1 required">30-50 Images</label>
								<input type="file" id="imageUpload" {...register('imageUpload')} multiple />
								<p className="error text-error">{errors.imageUpload?.message?.toString()}</p>
							</div>
						}
					</div>
					<div className="control text-secondary bg-accent-3 rounded-md p-4 !mb-3">
						<label htmlFor="coralDataSheet" className="mb-1 required">Coral Data Sheet Image</label>
						<input type="file" id="coralDataSheet" {...register('coralDataSheet')} accept="image/*" />
						<p className="error text-error">{errors.coralDataSheet?.message?.toString()}</p>
					</div>
					<div className="control text-secondary bg-accent-3 rounded-md p-4 !mb-3">
						<label htmlFor="surveyGuides" className="mb-1 required">Up to 12 Survey Guide Images</label>
						<input type="file" id="surveyGuides" {...register('surveyGuides')} multiple accept="image/*" />
						<p className="error text-error">{errors.surveyGuides?.message?.toString()}</p>
					</div>
				</>
			}
		</form>
	)
}
