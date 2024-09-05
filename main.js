document.addEventListener("DOMContentLoaded", function () {
	const gridSize = 4;
	const gridContainer = document.getElementById("grid-container");
	let grid = [];
	let score = 0;
	let HighScore = parseInt(localStorage.getItem("highScore")) || 0;

	function createGrid() {
		// document.addEventListener("keydown", handlePressKey);
		gridContainer.innerHTML = "";
		grid = Array.from({ length: gridSize * gridSize }, () => 0);

		for (let i = 0; i < gridSize * gridSize; i++) {
			const cell = document.createElement("div");
			cell.className = "grid-cell";
			gridContainer.appendChild(cell);
		}

		AddRandomTile();
		AddRandomTile();
	}

	function getRandomEmptyCell() {
		const emptyIndexes = grid
			.map((value, index) => (value === 0 ? index : -1))
			.filter((index) => index !== -1);
		const randomIndex =
			emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
		return randomIndex;
	}

	function AddRandomTile() {
		const index = getRandomEmptyCell();
		if (grid.includes(2048)) {
			winGame();
		} else if (index !== undefined) {
			// grid[0] = 2048;
			grid[index] = Math.random() < 0.9 ? 2 : 4;
			UpdateDisplay();
		} else {
			gameOver();
		}
	}

	function UpdateDisplay() {
		const cells = document.querySelectorAll(".grid-cell");
		cells.forEach((cell, index) => {
			const value = grid[index];
			cell.textContent = value !== 0 ? value : "";
			cell.style.backgroundColor =
				value !== 0 ? getTileColor(value) : "#ccc0b3";
			cell.style.color = value !== 0 ? "#776e65" : "transparent";
			cell.style.fontSize = value > 1000 ? "20px" : "25px";
		});
		if (score > HighScore) {
			document.querySelector(".span1").textContent = score;
		} else {
			document.querySelector(".span1").textContent = HighScore;
		}
		document.querySelector(".span").textContent = score;
	}

	function getTileColor(value) {
		switch (value) {
			case 2:
				return "#eee4da";
			case 4:
				return "#ede0c8";
			case 8:
				return "#f2b179";
			case 16:
				return "#f59563";
			case 32:
				return "#f67c5f";
			case 64:
				return "#f65e3b";
			case 128:
				return "#edcf72";
			case 256:
				return "#edcc61";
			case 512:
				return "#edc850";
			case 1024:
				return "#edc53f";
			case 2048:
				return "#edc22e";
			default:
				return "#ccc0b3";
		}
	}

	function handlePressKey(event) {
		switch (event.key) {
			case "ArrowUp":
				moveUp();
				break;
			case "ArrowDown":
				moveDown();
				break;
			case "ArrowLeft":
				moveLeft();
				break;
			case "ArrowRight":
				moveRight();
				break;
		}
		UpdateDisplay();
	}

	function winGame() {
		alert("You win! Congratulations!");
		document.removeEventListener("keydown", handlePressKey);
		SaveHighscore();
	}

	document.addEventListener("keydown", handlePressKey);

	function moveLeft() {
		for (let row = 0; row < gridSize; row++) {
			const startIndex = row * gridSize;
			const rowValues = grid.slice(startIndex, startIndex + gridSize);
			const newRow = mergeTiles(rowValues);
			for (let col = 0; col < gridSize; col++) {
				grid[startIndex + col] = newRow[col];
			}
		}
		AddRandomTile();
	}

	function moveRight() {
		for (let row = 0; row < gridSize; row++) {
			const startIndex = row * gridSize;
			const rowValues = grid.slice(startIndex, startIndex + gridSize);
			const newRow = mergeTiles(rowValues);
			for (let col = gridSize - 1; col >= 0; col--) {
				grid[startIndex + (gridSize - 1 - col)] = newRow[col];
			}
		}
		AddRandomTile();
	}

	function moveUp() {
		for (let col = 0; col < gridSize; col++) {
			const ColumnValues = [
				grid[col],
				grid[col + gridSize],
				grid[col + 2 * gridSize],
				grid[col + 3 * gridSize],
			];
			const newCol = mergeTiles(ColumnValues);
			for (let row = 0; row < gridSize; row++) {
				grid[row * gridSize + col] = newCol[row];
			}
		}
		AddRandomTile();
	}

	function moveDown() {
		for (let col = 0; col < gridSize; col++) {
			const ColumnValues = [
				grid[col],
				grid[col + gridSize],
				grid[col + 2 * gridSize],
				grid[col + 3 * gridSize],
			];
			const newCol = mergeTiles(ColumnValues);
			for (let row = gridSize - 1; row >= 0; row--) {
				grid[(gridSize - 1 - row) * gridSize + col] = newCol[row];
			}
		}
		AddRandomTile();
	}

	function mergeTiles(tiles) {
		const filteredTiles = tiles.filter((value) => value !== 0);
		const mergedTiles = [];
		let skipNext = false;

		for (let i = 0; i < filteredTiles.length; i++) {
			if (skipNext) {
				skipNext = false;
				continue;
			}
			if (filteredTiles[i] === filteredTiles[i + 1]) {
				mergedTiles.push(filteredTiles[i] * 2);
				score += filteredTiles[i] * 2;
				if (HighScore < score) {
					HighScore += filteredTiles[i] * 2;
				}
				skipNext = true;
			} else {
				mergedTiles.push(filteredTiles[i]);
			}
		}

		while (mergedTiles.length < gridSize) {
			mergedTiles.push(0);
		}

		return mergedTiles;
	}
	function gameOver() {
		alert("Game Over!");
		// document.removeEventListener("keydown", handlePressKey);
		SaveHighscore();
	}

	function SaveHighscore() {
		if (score > HighScore) {
			HighScore = score;
			localStorage.setItem("highscore", HighScore);
		}
	}

	document.querySelector(".new-game").addEventListener("click", function () {
		score = 0;
		document.querySelector(".span").textContent = score;
		createGrid();
	});

	createGrid();
});
