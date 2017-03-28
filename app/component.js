export default (text = 'Hello world') => {
	const element = document.createElement('div');

	element.innerHTML = text + 'test122';

	// element.className = 'pure-button';
	element.className = 'fa fa-hand-spock-o fa-1g';

	// 懒加载
	/*element.onclick = () => {
		import('./lazy').then((lazy) => {
			element.innerHTML = lazy.default;
		}).catch((e) => {
			console.error(e);
		});
	};*/

	element.onclick = () => {
		require.ensure([], (require) => {
			element.textContent = require('./lazy').default;
		}, 'lazy');
	};

	return element;
};