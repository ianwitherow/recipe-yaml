import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { TextInput, Textarea, Checkbox, Button, Group, Box, Grid, Code, CopyButton, Text } from '@mantine/core';
import { IconCopy, IconFileDownload, IconClearAll, IconMeat } from '@tabler/icons';
import { useForm } from '@mantine/form';

function App() {

	const [yaml, setYaml] = useState(null);

	const form = useForm({
		initialValues: {
			title: '',
			notes: '',
			servings: '',
			prep_time: '',
			cook_time: '',
			total_time: '',
			source: '',
			source_url: '',
			photo: '',
			categories: '',
			difficulty: '',
			ingredients: '',
			directions: ''
		}
	});

	const reset = () => {
		setYaml(null);
		form.reset();
	}

	const save = () => {
		console.log(form);
		const yamlData = new Blob([yaml], { type: 'text/yaml' });

		let a = document.createElement('a');
		a.href = URL.createObjectURL(yamlData);
		a.download = form.values.title + '.yml';
		a.click();
	}

	const createYaml = values => {
		console.log(values);
		const thatYaml = `name: ${values.title}
${values.notes && `notes: |
${values.notes.split('\n').map(l => ' ' + l).join('\n')}`}
${values.servings && `servings: ${values.servings}`}
${values.prep_time && `prep_time: ${values.prep_time}`}
${values.cook_time && `cook_time: ${values.cook_time}`}
${values.total_time && `total_time: ${values.total_time}`}
${values.source && `source: ${values.source}`}
${values.source_url && `source_url: ${values.source_url}`}
${values.photo && `photo: ${values.photo.replace('data:image/jpeg;base64,', '')}`}
${values.categories && `categories: [${values.categories}]`}
${values.difficulty && `difficulty: ${values.difficulty}`}
ingredients: |
${values.ingredients.split('\n').map(l => ' ' + l).join('\n')}

directions: |
${values.directions.split('\n').map(l => ' ' + l).join('\n')}`;

		setYaml(thatYaml);
		window.scrollTo(0, 0);
	}

	return (
		<div className="container mx-auto">
			<Grid p="lg">
				<Grid.Col span={5}>
					<Box mx="auto">
						<form onSubmit={form.onSubmit((values) => createYaml(values))}>
							<TextInput
								withAsterisk
								label="Title"
								placeholder="Recipe Title"
								{...form.getInputProps('title')}
							/>
							<Grid>
								<Grid.Col span={4}>
									<TextInput
										label="Servings"
										placeholder=""
										{...form.getInputProps('servings')}
									/>
								</Grid.Col>
								<Grid.Col span={2}>
									<TextInput
										label="Prep Time"
										placeholder=""
										{...form.getInputProps('prep_time')}
									/>
								</Grid.Col>
								<Grid.Col span={2}>
									<TextInput
										label="Cook Time"
										placeholder=""
										{...form.getInputProps('cook_time')}
									/>
								</Grid.Col>
								<Grid.Col span={2}>
									<TextInput
										label="Total Time"
										placeholder=""
										{...form.getInputProps('total_time')}
									/>
								</Grid.Col>
							</Grid>
							<Grid>
								<Grid.Col span={4}>
									<TextInput
										label="Category"
										placeholder=""
										{...form.getInputProps('categories')}
									/>
								</Grid.Col>
								<Grid.Col span={4}>
									<TextInput
										label="Difficulty"
										placeholder=""
										{...form.getInputProps('difficulty')}
									/>
								</Grid.Col>
							</Grid>
							<TextInput
								label="Source"
								placeholder=""
								{...form.getInputProps('source')}
							/>
							<TextInput
								label="Source URL"
								placeholder=""
								{...form.getInputProps('source_url')}
							/>
							<Textarea
								label="Photo"
								placeholder=""
								{...form.getInputProps('photo')}
							/>
							<Textarea
								withAsterisk
								label="Ingredients"
								autosize
								placeholder=""
								{...form.getInputProps('ingredients')}
							/>
							<Textarea
								withAsterisk
								label="Directions"
								autosize
								placeholder=""
								{...form.getInputProps('directions')}
							/>
							<Textarea
								label="Notes"
								{...form.getInputProps('notes')}
							/>

							<Group mt="md">
								<Button type="submit" leftIcon={<IconMeat />}>Generate YAML</Button>
								<Button color="yellow" onClick={reset} leftIcon={<IconClearAll />}>Reset</Button>
							</Group>
						</form>
					</Box>
				</Grid.Col>
				<Grid.Col span={6} offset={1}>
					<Box p="lg">
						{ yaml != null
							? (
								<>
									<Grid>
										<Grid.Col span={6}>
											<Group>
												<CopyButton value={yaml}>
													{({ copied, copy}) => (
														<Button color={copied ? 'teal' : 'blue'} onClick={copy} leftIcon={<IconCopy />}>
															{copied ? 'Copied!' : 'Copy'}
														</Button>
													)}
												</CopyButton>
												<Button color="teal" onClick={save} leftIcon={<IconFileDownload />}>
													Save
												</Button>
											</Group>
										</Grid.Col>

										<Grid.Col span={3} offset={3} align="right">
											<Button color="yellow" onClick={reset} align='right' position={{ right: 0 }} leftIcon={<IconClearAll />}>
												Clear
											</Button>
										</Grid.Col>
									</Grid>
									<Code block>
										{yaml}
									</Code>
								</>
							)
							: <Text>Enter a recipe to generate some YAML!</Text>
						}
					</Box>
				</Grid.Col>
			</Grid>

		</div>
	)
}

export default App
