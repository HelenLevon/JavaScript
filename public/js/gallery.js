let countImages = document.getElementById('count'),
	spaceForGalary = document.getElementById('gallary'),
	lineSelector = document.getElementById('line-selector');
	
class BaseGallery {
	constructor() {
		this.newData = [];
		this.visibleGalary = [];
		this._btnHandler = () => {
			this.run();
		};
		this._galleryContainerHandler = (event) => {
			this.removeElement(event);
		};
		this.boxesUrl = "http://localhost:3000/wooden_boxes";
		this.addItemBtn = document.querySelector("#add-item-btn");
		this.editBtn = document.querySelector("#save-edited-item");
		this.viewItemBtn = document.querySelector(".assignmentbtn");
		this.viewItemDiv = document.querySelector("#viewitem");
		this.formTitle = document.querySelector("#formtitle");
		this.selectedBlockItem = null;
	}
	sortGalary(visibleGalary) {
		console.log(lineSelector.value);
		if (lineSelector.value == "0") {
			return visibleGalary
		};
		let cases = {
			'1': "name",
			'2': "-name",
			'3': "-dateMSec",
			'4': "dateMSec",
		};
		return visibleGalary.sort(dynamicSort(cases[lineSelector.value]));

		function dynamicSort(property) {
			let sortOrder = 1;
			if (property[0] === "-") {
				sortOrder = -1;
				property = property.substr(1);
			}
			return function (a, b) {
				let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
				return result * sortOrder;
			}
		}
	};
	changeQuantity(visibleGalary) {
		countImages.innerHTML = visibleGalary.length;
	};
	renderGalary(visibleGalary) {
		let galary = [];
		visibleGalary.forEach(item => {
			galary.push(newElement(item));
		});

		function newElement(item) {
			return `\
				<div class="col-sm-3 col-xs-6 imgContainer">\
				<img src="${item.url}" alt="${item.name}" class="img-thumbnail img-height">\
				<div class="info-wrapper">\
					<div class="font-weight-bold text-center text-danger">${item.name}</div>\
					<div class="text-muted top-padding">${item.description}</div>\
					<div class="text-muted">${item.date}</div>\
					<div class="text-muted">${item.id}</div>\
					<div class="btn-group">
							<!--<button type="button" class="btn btn-outline-secondary">View</button>-->
							<button type="button" class="btn btn-info"\
							 id="editbtn" data-open-item="true" data-id="${item.id}">Edit</button>
						</div>
					<button class="btn btn-danger removeElement" data-remove-item="true" data-id = "${item.id}">Delete</button>
				</div>\
				</div>
				`;
		}
		spaceForGalary.innerHTML = galary.join(" ");
	};
	letSortGalary() {
		this.visibleGalary = this.sortGalary(this.visibleGalary);
		this.renderGalary(this.visibleGalary);
		this.setLocalStorage();
	};
	getDataFromLocalStorage() {
		lineSelector.value = (localStorage.getItem("sort")) ?
			localStorage.getItem("sort") :
			"1";
	};
	setLocalStorage() {
		localStorage.setItem("sort", lineSelector.value);
	};
	initComponentGallary() {
		this.getDataFromLocalStorage();
		fetch(this.boxesUrl).then(responce => responce.json())
			.then(data => {
				this.newData = utils.fetchData(data);
				this.visibleGalary = this.newData.slice();
				this.changeQuantity(this.visibleGalary);
				this.letSortGalary();
			});
	};
}

class ExtendedGallery extends BaseGallery {
	constructor() {
		super();
		this.name = document.getElementById('newname');
		this.description = document.getElementById('newdescript');
		this.imgUrl = document.getElementById('newimgurl');
		this.initEventOnce = true;
	}
	galleryEventHandlers() {
		console.log("init");
		lineSelector.addEventListener('change', () => {
			this.letSortGalary();
		});
		this.addItemBtn.addEventListener("click", (e) => {
			this.hideSelectedBlock(galleryContainer);
			this.prepareEmptyForm();
		});
		galleryContainer.addEventListener("click", (e) => {
			if (e.target.getAttribute("data-open-item")) {
				this.hideSelectedBlock(galleryContainer);
				this.editItemForm(e);
				super.letSortGalary();
			} else if (e.target.getAttribute("data-remove-item")) {
				this.removeItem(e);
				super.letSortGalary();
			}
		});
		this.viewItemDiv.addEventListener("click", (e) => {
			let assignment = e.target.dataset.assignment;
			if (assignment == "save-new") {
				this.saveNewItem(e);
			} else if (assignment == "edit-item") {
				this.saveEditedItem(e);
			}
		});
	};
	prepareEmptyForm() {
		this.showSelectedBlock(this.viewItemDiv);
		this.viewItemBtn.setAttribute("data-assignment", "save-new");
		this.formTitle.innerHTML = "Add new item";
	};
	showSelectedBlock(showBlock) {
		this.switchCssClass(showBlock, "d-none", "d-block");
	};
	hideSelectedBlock(showBlock) {
		this.switchCssClass(showBlock, "d-block", "d-none");
	};
	switchCssClass(nnode, rremoveClass, aaddClass) {
		nnode.classList.remove(rremoveClass);
		nnode.classList.add(aaddClass);
	};
	async saveNewItem(e) {
		let name = this.name.value;
		let description = this.description.value;
		let imgUrl = this.imgUrl.value;
		if (name && description && imgUrl) {
			await this.saveNewItemComp(name, description, imgUrl);
			this.clearForm();
			super.initComponentGallary();
			this.showSelectedBlock(galleryContainer);
			this.hideSelectedBlock(this.viewItemDiv);
			this.showMessage("Changes saved!");
		} else {
			
			this.showMessage("All fields are required!");
		}
	};
	async saveNewItemComp(name, description, imgUrl) {
		let newdate = new Date();
		console.log(newdate.getTime());
		let newItem = {
			url: imgUrl,
			name: name,
			description: description,
			date: newdate.getTime()
		}
		const response = await fetch(this.boxesUrl, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newItem)
		});
		return response.json();
	};
	async removeItem(e) {
		const movedItemId = e.target.getAttribute("data-id");
		const response = await fetch(`${this.boxesUrl}/${movedItemId}`, {
			method: 'delete'
		});
		if (response.status == "200") {
			return super.initComponentGallary();
		} else {
			console.log('3333');
		}
	};
	async viewItemComp(e) {
		const editItemId = e.target.getAttribute("data-id");
		const response = await fetch(this.boxesUrl + "/" + editItemId);
		return response.json();
	};
	async editItemForm(e) {
		const data = await this.viewItemComp(e);
		this.showSelectedBlock(this.viewItemDiv);
		this.name.value = data.name;
		this.description.value = data.description;
		this.imgUrl.value = data.url;
		this.viewItemBtn.setAttribute("data-assignment", "edit-item");
		this.viewItemBtn.setAttribute("data-id", data.id);
		this.formTitle.innerHTML = "Edit item";
	};
	async saveEditedItemComp(e, name, description, imgUrl) {
		let editItem = {
			url: imgUrl,
			name: name,
			description: description
		}
		const editItemId = e.target.getAttribute("data-id");
		const response = await fetch(this.boxesUrl + "/" + editItemId, {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(editItem)
		});
		return response.json();
	};
	async saveEditedItem(e) {
		let name = this.name.value;
		let description = this.description.value;
		let imgUrl = this.imgUrl.value;
		if (name && description && imgUrl) {
			await this.saveEditedItemComp(e, name, description, imgUrl);
			this.clearForm();
			super.initComponentGallary();
			this.showSelectedBlock(galleryContainer);
			this.hideSelectedBlock(this.viewItemDiv);
			this.showMessage("Changes saved!");
		} else {
			e.preventDefault();
			this.showMessage("All fields are required!");
		}
	};
	showMessage(text) {
		const alerts = document.querySelector(".modal-body");
		let innerText = `<p class="text-left">${text}</p>`;
		alerts.innerHTML = innerText;
		$(".myModal").modal("show");
	};
	clearForm() {
		this.name.value = "";
		this.description.value = "";
		this.imgUrl.value = "";
	}
}