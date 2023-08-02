import { UPLOAD_MODES } from "@lib/upload-modes"
import { SurveyFormProps } from "."
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { shallow } from "zustand/shallow"
import { Survey, useSurveyStore } from "@stores/survey-store"
import { IFileUploads, fileUploadSchema } from "./file-upload-schema"

const storeSelector = (state: Survey) => [state.uploads, state.setUploads] as const

export function Uploads({ submitHandler, backHandler }: SurveyFormProps) {
	const [uploads, setUploads] = useSurveyStore(storeSelector, shallow)
	const { register, handleSubmit, formState: { errors }, watch } = useForm<IFileUploads>({
		resolver: yupResolver(fileUploadSchema),
		defaultValues: uploads
	})

	const mode = watch('mode')

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
			<div className="control text-secondary">
				<p className="label required mb-1">What are you uploading?</p>
				<div className="space-y-1 ml-2">
					{UPLOAD_MODES.map(mode =>
						<label key={mode} htmlFor={mode} className="cursor-pointer flex items-center space-x-2">
							<input type="radio" id={mode} {...register('mode')} value={mode} />
							<span className="translate-y-0.5">{mode}</span>
						</label>
					)}
				</div>
				<p className="error text-error">{errors.mode?.message?.toString()}</p>
			</div>
			{mode === 'CPCE' &&
				<div className="control text-secondary">
					<label htmlFor="zip" className="mb-1 required">ZIP file containg Excel, images, and cpc files</label>
					<input type="file" id="zip" {...register('zip')} />
					<p className="error text-error">{errors.zip?.message?.toString()}</p>
				</div>
			}
			{mode === 'ALWAN' &&
				<>
					<div className="control text-secondary">
						<label htmlFor="zip" className="mb-1 required">ZIP file containg 30-50 images</label>
						<input type="file" id="zip" {...register('zip')} />
						<p className="error text-error">{errors.zip?.message?.toString()}</p>
					</div>
					<div className="control text-secondary">
						<label htmlFor="alwan-data-form" className="mb-1 required">ALWAN Data Form</label>
						<input type="file" id="alwan-data-form" {...register('alwanDataForm')} />
						<p className="error text-error">{errors.alwanDataForm?.message?.toString()}</p>
					</div>
				</>
			}
			{mode === 'MANUAL' &&
				<>
					<div className="control text-secondary">
						<label htmlFor="zip" className="mb-1 required">ZIP file containg 30-50 images</label>
						<input type="file" id="zip" {...register('zip')} />
						<p className="error text-error">{errors.zip?.message?.toString()}</p>
					</div>
					<div className="control text-secondary">
						<label htmlFor="coral-data-sheet" className="mb-1 required">Coral Data Sheet</label>
						<input type="file" id="coral-data-sheet" {...register('coralDataSheet')} />
						<p className="error text-error">{errors.coralDataSheet?.message?.toString()}</p>
					</div>
					<div className="control text-secondary">
						<label htmlFor="survey-guides" className="mb-1 required">Survey Guides</label>
						<input type="file" id="survey-guides" {...register('surveyGuides')} multiple accept="image/*" />
						<p className="error text-error">{errors.surveyGuides?.message?.toString()}</p>
					</div>
				</>
			}
		</form>
	)
}
