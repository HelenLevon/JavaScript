const utils = {

	fetchData: function (data) {
		const doNewTransform = (el, index, arr) => {
			return {
				name: newName(el),
				id: el.id,
				url: el.url,
				description: newDescription(el),
				date: newDate(el),
				dateMSec: el.date,
			};
		}
		const newName = (el) => {
			return el.name.slice().toUpperCase();
		}
		const newDescription = (el) => {
			return (el.description.length > 15) ?
				el.description.substr(0, 15) + "..." :
				el.description;
		}
		const newDate = (el) => {
			return moment(el.date).format('YYYY/M/D h:mm');
		}
		return data.map(doNewTransform);
	},

};