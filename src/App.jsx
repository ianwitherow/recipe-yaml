import { useState, useEffect } from 'react'
import {
	TextInput,
	Textarea,
	Checkbox,
	Button,
	Group,
	Box,
	Grid,
	Code,
	CopyButton,
	Text,
	FileInput
} from '@mantine/core';
import { IconCopy, IconFileDownload, IconClearAll, IconMeat } from '@tabler/icons';
import { useForm } from '@mantine/form';

function App() {

	const [yaml, setYaml] = useState(null);
	const [yamlDisplay, setYamlDisplay] = useState(null);
	const [imageBase64, setImageBase64] = useState(null);


	const form = useForm({
		initialValues: {
			name: '',
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
		const yamlData = new Blob([yaml], { type: 'text/yaml' });

		let a = document.createElement('a');
		a.href = URL.createObjectURL(yamlData);
		a.download = form.values.name + '.yml';
		a.click();
	}



	const createYaml = values => {
		console.log(values);
		const isBlank = Object.keys(values).every(k => values[k] == '' || values[k] == null);
		if (isBlank) {
			setYaml(null);
			return;
		}

		const yamlLines = Object.keys(values)
			.map(key => toYaml(key, values[key]))
			.filter(Boolean);

		const yamlDisplay = Object.keys(values)
			.map(key => toYaml(key, values[key], true))
			.filter(Boolean);

		setYaml(yamlLines.join('\n'));
		setYamlDisplay(yamlDisplay.join('\n'));

		window.scrollTo(0, 0);
	}

	function toYaml(key, value, forDisplay = false) {
		if (value == null || value.length === 0) return null;
		const multiline = ['ingredients', 'directions', 'notes'];
		const arrayValue = ['categories'];

		if (multiline.includes(key)) {
			return `${key}: |\n${value.split('\n').map(l => ' ' + l).join('\n')}`;
		}

		if (arrayValue.includes(key)) {
			return `${key}: [${value}]`;
		}

		// There's only one binary/photo thing, just gonna hard code it.
		if (key === 'photo') {
			value = forDisplay ? "[binary]" : imageBase64;
		}

		return `${key}: ${value}`;
	}


	function imageToBase64(file) {
		const reader = new FileReader();
		return reader.readAsDataURL(file);
	}

	useEffect(() => {
		let newBase64Str = null;

		if (form.values.photo) {
			let fr = new FileReader();

			fr.onload = () => setImageBase64(fr.result.replace(/^data:image\/.*?base64,/, ''));
			fr.readAsDataURL(form.values.photo);
		} else {
			setImageBase64(null);
		}

	}, [form.values.photo]);

	useEffect(() => {
		createYaml(form.values);
	}, [form.values, imageBase64]);

	return (
		<div className="container mx-auto">
			<Grid p="lg">
				<Grid.Col span={5}>
					<Box mx="auto">
						<form onSubmit={form.onSubmit((values) => createYaml(values))}>
							<TextInput
								withAsterisk
								label="Title"
								{...form.getInputProps('name')}
							/>
							<Grid>
								<Grid.Col span={4}>
									<TextInput
										label="Servings"
										{...form.getInputProps('servings')}
									/>
								</Grid.Col>
								<Grid.Col span={2}>
									<TextInput
										label="Prep Time"
										{...form.getInputProps('prep_time')}
									/>
								</Grid.Col>
								<Grid.Col span={2}>
									<TextInput
										label="Cook Time"
										{...form.getInputProps('cook_time')}
									/>
								</Grid.Col>
								<Grid.Col span={2}>
									<TextInput
										label="Total Time"
										{...form.getInputProps('total_time')}
									/>
								</Grid.Col>
							</Grid>
							<Grid>
								<Grid.Col span={4}>
									<TextInput
										label="Category"
										placeholder="E.g., 'Weeknight', 'Pasta', etc"
										{...form.getInputProps('categories')}
									/>
								</Grid.Col>
								<Grid.Col span={4}>
									<TextInput
										label="Difficulty"
										{...form.getInputProps('difficulty')}
									/>
								</Grid.Col>
							</Grid>
							<TextInput
								label="Source"
								placeholder="E.g., Serious Eats"
								{...form.getInputProps('source')}
							/>
							<TextInput
								label="Source URL"
								placeholder="E.g., https://seriouseats.com/recipes/chickn"
								{...form.getInputProps('source_url')}
							/>
							<FileInput
								{...form.getInputProps('photo')}
								label="Photo"
								placeholder="Pick file"
							/>
							{form.values.photo && (
								<>
									<Button variant="subtle" onClick={() => { form.values.photo = null; setImageBase64(null); }}>Clear</Button>
									<br />
									<img src={URL.createObjectURL(form.values.photo)} style={{ maxWidth: '200px' }} />
								</>
							)}
							<Textarea
								withAsterisk
								label="Ingredients"
								autosize
								{...form.getInputProps('ingredients')}
							/>
							<Textarea
								withAsterisk
								label="Directions"
								autosize
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
										{yamlDisplay}
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
