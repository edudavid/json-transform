const transform = require('../index').transform;

const afterTransform = (element) => Object.assign({}, element, {
	categoryCode: element.label == 'books' ? 101 : 102
});

const buildProduct = (name, category, price, photos, vendor, code) => ({
	name,
	category,
	price,
	photos,
	meta: { vendor },
	code,
});

const product1 = buildProduct('Hello world', 'books', '200',
	[ 
		{ title: 'photo1', photoUrl: 'http://photo1.jpg', isCover: true },
		{ title: 'photo2', photoUrl: 'http://photo2.jpg' }
	],
	'Author name',
	'BOOK01'
);

const product2 = buildProduct('My Digital Product', 'digital', '500',
	[ 
		{ title: 'photo3', photoUrl: 'http://photo3.jpg', isCover: true },
		{ title: 'photo4', photoUrl: 'http://photo4.jpg' }
	],
	'Global Digital',
	'DIGITAL01'
);

const template = {
	title: {
		path: 'name',
		transform: (val) => val.toUpperCase()
	},
	label: {
		path: ['category', 'categories'],
	},
	vendor: {
		path: 'meta.vendor'
	},
	'meta.photos': {
		path: 'photos',
		transform: (val) => val.map(photo => photo.photoUrl)
	},
	'meta.id': {
		path: 'code'
	}
};


test('converts json object based on template', () => {
	const convertedJson = transform(product1, template);

	expect(convertedJson.title).toBe('HELLO WORLD');
	expect(convertedJson.label).toBe('books');
	expect(convertedJson.vendor).toBe('Author name');
});

test('executes transformation callback for a single object', () => {
	const convertedJson = transform(product1, template, afterTransform);

	expect(convertedJson.categoryCode).toBe(101);
});

test('converts json object based on template with nested path', () => {
	const convertedJson = transform(product1, template);

	expect(convertedJson.meta.photos[0]).toBe('http://photo1.jpg');
	expect(convertedJson.meta.photos[1]).toBe('http://photo2.jpg');
	expect(convertedJson.meta.id).toBe('BOOK01');
});

test('converts array of json objects based on template', () => {

	const convertedJsonArray = transform([product1, product2], template);

	expect(convertedJsonArray[0].title).toBe('HELLO WORLD');
	expect(convertedJsonArray[0].label).toBe('books');
	expect(convertedJsonArray[0].vendor).toBe('Author name');
	expect(convertedJsonArray[0].meta.photos[0]).toBe('http://photo1.jpg');
	expect(convertedJsonArray[0].meta.photos[1]).toBe('http://photo2.jpg');

	expect(convertedJsonArray[1].title).toBe('MY DIGITAL PRODUCT');
	expect(convertedJsonArray[1].label).toBe('digital');
	expect(convertedJsonArray[1].vendor).toBe('Global Digital');
	expect(convertedJsonArray[1].meta.photos[0]).toBe('http://photo3.jpg');
	expect(convertedJsonArray[1].meta.photos[1]).toBe('http://photo4.jpg');
});

test('executes transformation callback for all array objects', () => {

	const convertedJsonArray = transform([product1, product2], template, afterTransform);

	expect(convertedJsonArray[0].categoryCode).toBe(101);
	expect(convertedJsonArray[1].categoryCode).toBe(102);
});