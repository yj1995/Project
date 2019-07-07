import {
	Point,
	Container,
	loader
} from 'pixi.js';
import {
	FX
} from 'revolt-fx';
import Hud from './Hud';
import Card from './Card';

const MAX_X = window.innerWidth;
const MAX_Y = window.innerHeight;

const textStyle = {
	fontFamily: 'Arial',
	fontSize: '30px',
	align: 'left',
	fill: 'white'
};

const HUD_POSITIONS = {
	RIGHT_TOP_CORNER: new Point(MAX_X - 125, 12),
	RIGHT_BOTTOM_CORNER: new Point(MAX_X - 10, MAX_Y - 20),
	CENTER: new Point(MAX_X * 0.50, MAX_Y * 0.50),
	CENTER_TOP: new Point(MAX_X * 0.50 - 150, 30),
	TASK1_BUTTON: new Point(MAX_X * 0.50 - 125, MAX_Y * 0.35),
	TASK2_BUTTON: new Point(MAX_X * 0.50 - 125, MAX_Y * 0.50),
	TASK3_BUTTON: new Point(MAX_X * 0.50 - 125, MAX_Y * 0.65),
	LEFT_TOP_CORNER: new Point(MAX_X * 0.01, 30),
	LEFT_BOTTOM_CORNER: new Point(10, MAX_Y * 0.95)
};

class Stage extends Container {

	/**
	 * Stage Constructor
	 * Container for the game
	 * @param opts
	 * @param opts.spritesheet - The path to the spritesheet file
	 */
	constructor(opts) {
		super();
		this.spritesheet = opts.spritesheet;
		this.hud = new Hud();

		this.fx = new FX();

		this.ticker = new PIXI.ticker.Ticker();
		this.ticker.start();
		this.ticker.add((delta) => {
			this.fx.update();
		});

		this._initStage();
	}

	/**
	 * _initStage
	 * Private method that adds all of the elements to the scene
	 * @private
	 */
	_initStage() {
		this.addChild(this.hud);

		this.selectedTask = -1;

		this.hud.addText('welcome', {
			text: 'Welcome to PixiJS Tasks',
			textStyle: {
				fontFamily: 'Arial',
				fontSize: '30px',
				align: 'center',
				fill: 'white'
			},
			position: HUD_POSITIONS.CENTER_TOP,
			anchor: {
				x: 0,
				y: 0
			}
		});

		this.addFPSText();

		this.addTaskButtons();
	}

	refreshStage() {
		this.hud.removeChildren(0);
		this.removeChildren(0);
		this._initStage();
	}

	addFPSText() {
		this.hud.addText('fps', {
			textStyle,
			position: HUD_POSITIONS.LEFT_TOP_CORNER,
			anchor: {
				x: 0,
				y: 0
			}
		});
	}

	setFPSText(val) {
		if (this.hud.fpsTextBox)
			this.hud.fpsTextBox.text = val;
	}

	addBackToMenuButton() {
		this.hud.addButtonContainer('returnBack', {
			spritesheet: this.spritesheet,
			position: HUD_POSITIONS.RIGHT_TOP_CORNER,
			text: 'Back to Menu',
			anchor: {
				x: 0.5,
				y: 0.5
			},
			textStyle: {
				fontFamily: 'Arial',
				fontSize: '30px',
				align: 'left',
				fill: 'white'
			},
			textMargin: 0,
			textAllignment: -1
		}, this.onBackToMenuButton);
	}

	onBackToMenuButton() {
		switch (this.parent.parent.selectedTask) {
			case 1:
				this.parent.parent.stopTask1();
				break;
			case 2:
				this.parent.parent.stopTask2();
				break;
			case 2:
				this.parent.parent.stopTask3();
				break;
			default:
				break;
		}
		this.parent.parent.refreshStage();
		this.removeChildren(0);
	}

	addTaskButtons() {
		this.hud.addButtonContainer('task1', {
			spritesheet: this.spritesheet,
			position: HUD_POSITIONS.TASK1_BUTTON,
			text: 'Task 1',
			anchor: {
				x: 0.5,
				y: 0.5
			},
			textStyle
		}, this.onTask1ButtonDown);

		this.hud.addButtonContainer('task2', {
			spritesheet: this.spritesheet,
			position: HUD_POSITIONS.TASK2_BUTTON,
			text: 'Task 2',
			anchor: {
				x: 0.5,
				y: 0.5
			},
			textStyle
		}, this.onTask2ButtonDown);

		this.hud.addButtonContainer('task3', {
			spritesheet: this.spritesheet,
			position: HUD_POSITIONS.TASK3_BUTTON,
			text: 'Task 3',
			anchor: {
				x: 0.5,
				y: 0.5
			},
			textStyle
		}, this.onTask3ButtonDown);
	}

	onTask1ButtonDown() {
		this.parent.parent.addBackToMenuButton();
		this.parent.parent.startTask1();
		this.parent.parent.removeAllTaskButtons();
	}

	onTask2ButtonDown() {
		this.parent.parent.addBackToMenuButton();
		this.parent.parent.startTask2();
		this.parent.parent.removeAllTaskButtons();
	}

	onTask3ButtonDown() {
		this.parent.parent.addBackToMenuButton();
		this.parent.parent.startTask3();
		this.parent.parent.removeAllTaskButtons();
	}

	removeAllTaskButtons() {
		this.hud.task1Container.removeChildren(0);
		this.hud.task2Container.removeChildren(0);
		this.hud.task3Container.removeChildren(0);
	}

	startTask1() {
		this.selectedTask = 1;
		this.sprites = [];
		this.reversedSprites = [];
		this.spritePositions = [];
		this.cardCollection = [];

		let spritePadding = 0;
		const TotalOfCard = 144;
		const noOfCard = 52;
		const card = {
			scale: 1,
			intX: 150,
			intY: 70,
			padding: 2.85
		}

		//create 144 sprites and store in sprites array
		for (let i = 0; i < TotalOfCard; i++) {
			//there aren't 144 different images, return back to starting positions in every 53 icons
			let index = (i > noOfCard ? i - noOfCard + 1 : i);
			index = (index > noOfCard ? index - noOfCard + 1 : index);

			let sprite = new PIXI.Sprite(loader.resources[this.spritesheet].textures['card' + index + '.png']);
			sprite.position.set(card.intX, card.intY + spritePadding);
			sprite.scale.set(card.scale)
			spritePadding += card.padding; // add some padding
			this.sprites.push(sprite);
			this.spritePositions.push(sprite.position);
			this.addChild(sprite);
		}

		this.spritePositions.reverse(); //reverse all positions because reversed array will use this positions
	}

	addSpriteToReversedArray() {
		const cardAnimationTime = 2 * 1000;
		if (this.sprites) {
			if (this.sprites.length > 0) {
				let lastSprite = this.sprites[this.sprites.length - 1];
				//store last sprite from first sprite array in Card object
				//the card object includes startPosition and expectedPosition for move animation with move duration
				let card = new Card();
				card.sprite = lastSprite;
				card.startPosition = lastSprite.position;
				card.expectedPosition = this.spritePositions[this.reversedSprites.length];
				card.moveDuration = cardAnimationTime;
				this.cardCollection.push(card);

				this.sprites.pop();
				this.reversedSprites.push(lastSprite);

				this.addChild(lastSprite);
			}
		}
	}

	animate() {
		if (this.cardCollection) {
			for (let card of this.cardCollection) {
				card.move(this.ticker.elapsedMS);
			}
		}
	}

	stopTask1() {
		this.selectedTask = -1;
		this.sprites = [];
		this.reversedSprites = [];
		this.spritePositions = [];
		this.cardCollection = [];
	}

	startTask2() {
		this.selectedTask = 2;
		this.randomContainerTimer = 0;
		this.randomContainerDuration = 2 * 1000;

		if (this.hud.randomContainer)
			this.hud.randomContainer.removeChildren(0);

		this.hud.addRandomContainer("random", {
			spritesheet: this.spritesheet,
			position: HUD_POSITIONS.CENTER
		});
	}

	tickTask2Timer() {
		if (this.randomContainerDuration > 0) {
			this.randomContainerTimer += this.ticker.elapsedMS;
			if (this.randomContainerTimer >= this.randomContainerDuration) {
				this.startTask2();
			}
		}
	}

	stopTask2() {
		this.selectedTask = -1;
		this.randomContainerTimer = 0;
		this.randomContainerDuration = 0;
		this.hud.randomContainer.removeChildren(0);
	}

	startTask3() {
		let rectangle = {
			intX: -1 * MAX_X * 0.5,
			intY: -1 * MAX_Y * 0.5,
			width: MAX_X * 1,
			height: MAX_Y * 1.1,
			color: 0x383838
		};
		let content = new PIXI.Container();
		content.x = MAX_X * 0.5;
		content.y = MAX_Y * 0.5;
		content.scale.set(0.7)
		this.addChild(content);

		let graphics = new PIXI.Graphics();

		graphics.lineStyle(2, 0x64b0ff, 1);
		graphics.beginFill(rectangle.color, 1);
		graphics.drawRect(rectangle.intX, rectangle.intY, rectangle.width, rectangle.height);
		content.addChild(graphics);

		//add fire-arc fx from RevoltFX library
		//changed letiables in assets/defult-bundle.json using the editor at https://editor.revoltfx.electronauts.net/
		let emitter = this.fx.getParticleEmitter('fire-arc', true, true);
		emitter.init(content);
	}

	stopTask3() {
		this.selectedTask = -1;
	}
}

export default Stage;