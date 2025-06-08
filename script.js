// --- Script del Simulador de Fútbol (sin cambios, tal como lo proporcionaste) ---
        // --- Canvas and Context Setup ---
        const canvas = document.getElementById('footballField');
        const ctx = canvas.getContext('2d');

        // --- Game Constants ---
        const FIELD_COLOR = '#38A169';
        const LINE_COLOR = '#FFFFFF';
        const PLAYER_RADIUS = 10;
        const BALL_RADIUS = 6;
        const GOAL_WIDTH = 120;
        const GOAL_DEPTH = 20;
        const POST_RADIUS = 8;

        const FIELD_WIDTH = canvas.width;
        const FIELD_HEIGHT = canvas.height;
        const FIELD_MARGIN = 30;

        const centerX = FIELD_WIDTH / 2;
        const centerY = FIELD_HEIGHT / 2;

        const MAX_PLAYER_SPEED = 2.8;
        const BALL_FRICTION = 0.987;
        const BALL_STOP_THRESHOLD = 0.02;
        const KICK_STRENGTH = 11;
        const SHOT_STRENGTH = 20;
        const PASS_STRENGTH_SHORT = 9;
        const PASS_STRENGTH_THROUGH = 12.5;
        const PASS_STRENGTH_LONG = 16;
        const CROSS_STRENGTH = 13.5;
        const GOALKEEPER_CLEARANCE_STRENGTH = SHOT_STRENGTH * 1.4;
        const THROW_IN_STRENGTH = PASS_STRENGTH_SHORT * 0.9;
        const CORNER_KICK_STRENGTH = PASS_STRENGTH_SHORT * 1.4;
        const FREE_KICK_PASS_STRENGTH = PASS_STRENGTH_SHORT * 1.1;
        const FREE_KICK_SHOT_STRENGTH = SHOT_STRENGTH * 0.9;
        const WALL_PASS_STRENGTH = PASS_STRENGTH_SHORT * 0.9;


        const INTERCEPT_DISTANCE = PLAYER_RADIUS + BALL_RADIUS + 4;
        const TARGET_LOOSE_BALL_RANGE = PLAYER_RADIUS + BALL_RADIUS + 25;
        const MIN_DIST_TO_OPPONENT_FOR_SPACE = PLAYER_RADIUS * 7;
        const MIN_DIST_TO_TEAMMATE_FOR_SPACE = PLAYER_RADIUS * 5.5;
        const BALL_PREDICTION_TIME = 8;
        const MARKING_DISTANCE_TIGHT = PLAYER_RADIUS * 4;
        const MARKING_DISTANCE_LOOSE = PLAYER_RADIUS * 7;
        const PRESSURE_DISTANCE_ON_PASSER = PLAYER_RADIUS * 5;
        const CONFRONTATION_DISTANCE_FOR_DRIBBLING = PLAYER_RADIUS * 5;
        const DRIBBLING_SIDE_STEP_DIST = PLAYER_RADIUS * 2.8;
        const DRIBBLING_FORWARD_STEP_DIST = PLAYER_RADIUS * 3.2;
        const PASS_LANE_COVER_DISTANCE = FIELD_WIDTH / 5;
        const TACKLE_COOLDOWN_MS = 2500;
        const MUST_PASS_AFTER_TACKLE_DURATION_MS = 1800;
        const MAX_ALLOWED_DIST_FROM_BASE_ZONE_X_FACTOR = 0.20;
        const MAX_ALLOWED_DIST_FROM_BASE_ZONE_Y_FACTOR = 0.25;
        const WALL_PASS_OFFER_DISTANCE_MAX = PLAYER_RADIUS * 12;
        const WALL_PASS_OFFER_DISTANCE_MIN = PLAYER_RADIUS * 5;
        const FOUL_CHANCE_RECKLESS = 0.15;
        const FOUL_CHANCE_FROM_BEHIND = 0.35;
        const FREEKICK_WALL_DISTANCE = PLAYER_RADIUS * 10;
        const CROSSING_ZONE_X_DEPTH_FACTOR = 0.35;
        const CROSSING_ZONE_Y_BUFFER = FIELD_HEIGHT * 0.20;
        const HOLD_UP_PLAY_DURATION_FRAMES = 100;
        const CHANCE_TO_HOLD_UP = 0.25;
        const STRIKER_OFFSIDE_RUN_CHANCE = 0.35;
        const WINGER_RUN_WIDE_CHANCE = 0.3;
        const WINGER_CUT_INSIDE_CHANCE = 0.25;
        const FRAMES_TO_SETTLE_BALL = 20;
        const FREEKICK_SHOOT_RANGE_X = FIELD_WIDTH * 0.35;
        const FREEKICK_SHOOT_CHANCE_BASE = 0.25;
        const FREEKICK_SUPPORT_PLAYER_DIST = PLAYER_RADIUS * 8;
        const SIDELINE_HUG_BUFFER = PLAYER_RADIUS + 5;
        const CUT_BACK_CHANCE = 0.3;
        const CHANCE_PLAYER_MAKES_CROSS_RUN = 0.6;
        const CROSS_TARGET_BOX_DEPTH = PLAYER_RADIUS * 10;
        const CROSS_TARGET_BOX_WIDTH = GOAL_WIDTH * 0.8;
        const BASE_KICK_ERROR_ANGLE = Math.PI / 72;
        const ESCAPE_DRIBBLE_CHANCE = 0.15;
        const ESCAPE_DRIBBLE_STRENGTH = PLAYER_RADIUS * 0.8;
        const ESCAPE_DRIBBLE_DURATION_FRAMES = 30;
        const ESCAPE_DRIBBLE_TARGET_DISTANCE = PLAYER_RADIUS * 10;
        const OVERLAP_RUN_CHANCE = 0.15;
        const WINGER_MIN_X_FOR_OVERLAP = centerX * 0.8;
        const LATERAL_MAX_X_FOR_OVERLAP = centerX * 1.2;
        const HIGH_PASS_AIRBORNE_DURATION_FACTOR = 2.5;
        const MAX_AIRBORNE_FRAMES = 70;
        const MIN_AIRBORNE_FRAMES = 20;
        const AIRBORNE_BALL_RADIUS_SCALE = 0.7;
        const SHADOW_COLOR = 'rgba(0, 0, 0, 0.15)';
        const CHANCE_FOR_HIGH_CROSS = 0.5;
        const CHANCE_FOR_HIGH_LONG_PASS = 0.25;
        const HEADER_ATTEMPT_RANGE = PLAYER_RADIUS * 3;
        const HEADER_SHOT_STRENGTH_FACTOR = 0.85;
        const HEADER_PASS_STRENGTH_FACTOR = 0.7;


        // Fatigue Constants
        const STAMINA_MAX_DEFAULT = 100;
        const STAMINA_MIN_EFFECTIVE = 20;
        const STAMINA_DECREASE_PASSIVE = 0.003;
        const STAMINA_DECREASE_SPRINT = 0.025;
        const STAMINA_DECREASE_PRESSING = 0.015;
        const STAMINA_DECREASE_DRIBBLING_SPRINT = 0.010;
        const STAMINA_RECOVERY_PASSIVE = 0.01;
        const FATIGUE_EFFECT_ON_SPEED_THRESHOLD = 0.6;
        const MIN_SPEED_FATIGUE_FACTOR = 0.5;
        const FATIGUE_EFFECT_ON_ACCURACY_THRESHOLD = 0.5;
        const MAX_KICK_ANGLE_ERROR_FATIGUE = Math.PI / 24;
        const MIN_KICK_STRENGTH_FATIGUE_FACTOR = 0.75;


        const FRAMES_PER_SECOND = 60;
        const TOTAL_MATCH_MINUTES_SIMULATED = 3;
        const TOTAL_MATCH_TIME_SECONDS = TOTAL_MATCH_MINUTES_SIMULATED * 60;


        const ATTACKING_HOTZONE = { xMinTeamA: centerX - (FIELD_WIDTH * 0.1), xMaxTeamA: FIELD_WIDTH - FIELD_MARGIN - (FIELD_WIDTH * 0.1), xMinTeamB: FIELD_MARGIN + (FIELD_WIDTH * 0.1), xMaxTeamB: centerX + (FIELD_WIDTH * 0.1), yMin: centerY - GOAL_WIDTH * 1.0, yMax: centerY + GOAL_WIDTH * 1.0, widthTeamA: (FIELD_WIDTH - FIELD_MARGIN - (FIELD_WIDTH * 0.1)) - (centerX - (FIELD_WIDTH * 0.1)), widthTeamB: (centerX + (FIELD_WIDTH * 0.1)) - (FIELD_MARGIN + (FIELD_WIDTH * 0.1)), height: (centerY + GOAL_WIDTH * 1.0) - (centerY - GOAL_WIDTH * 1.0) };

        // Global game state variables that will be set by initGame
        let teamA_tactic;
        let teamB_tactic;
        let teamA_playWidth;
        let teamB_playWidth;
        let teamAName;
        let teamBName;

        let playersTeamA = []; let playersTeamB = []; let ball;
        let scoreTeamA = 0; let scoreTeamB = 0;
        let gameState = 'kickOff';
        let restartTimer = 0;
        const RESTART_DELAY_FRAMES = 90;
        let gameTimeElapsedFrames = 0;

        // --- Definición de Equipos ---
        const SIM_USER_TEAM_KEY = "user_team"; // Renombrado para evitar conflicto con el del manager si estuvieran en el mismo scope global directo
        const SIM_TEAMS_DATA = { // Renombrado para evitar conflicto
            [SIM_USER_TEAM_KEY]: {
                name: "Mi Equipo CF",
                color: "#FFD700",
                initialTactic: "equilibrado",
                initialPlayWidth: "normal",
                formation: [
                    { x: FIELD_MARGIN + 50, y: centerY, type: 'goalkeeper', specificRole: 'GK' },
                    { x: FIELD_MARGIN + 150, y: centerY - 150, type: 'defender', specificRole: 'LB_Wingback' },
                    { x: FIELD_MARGIN + 100, y: centerY - 50, type: 'defender', specificRole: 'CB_Stopper' },
                    { x: FIELD_MARGIN + 100, y: centerY + 50, type: 'defender', specificRole: 'CB_Stopper' },
                    { x: FIELD_MARGIN + 150, y: centerY + 150, type: 'defender', specificRole: 'RB_Wingback' },
                    { x: centerX - 80, y: centerY - 100, type: 'midfielder', specificRole: 'CM_BoxToBox' },
                    { x: centerX - 80, y: centerY + 100, type: 'midfielder', specificRole: 'CM_Playmaker' },
                    { x: centerX + 0, y: centerY - 200, type: 'midfielder', specificRole: 'LW_Dribbler' },
                    { x: centerX + 0, y: centerY + 200, type: 'midfielder', specificRole: 'RW_Dribbler' },
                    { x: centerX + 100, y: centerY - 50, type: 'attacker', specificRole: 'ST_Finisher' },
                    { x: centerX + 100, y: centerY + 50, type: 'attacker', specificRole: 'ST_Finisher' }
                ]
            },
            "MadridCity": {
                name: "Madrid City",
                color: "#FFFFFF",
                initialTactic: "ofensivo",
                initialPlayWidth: "normal",
                formation: [
                    { x: FIELD_MARGIN + 50, y: centerY, type: 'goalkeeper', specificRole: 'GK' },
                    { x: FIELD_MARGIN + 150, y: centerY - 190, type: 'defender', specificRole: 'LB_Wingback' },
                    { x: FIELD_MARGIN + 120, y: centerY - 70, type: 'defender', specificRole: 'CB_Stopper' },
                    { x: FIELD_MARGIN + 120, y: centerY + 70, type: 'defender', specificRole: 'CB_Stopper' },
                    { x: FIELD_MARGIN + 150, y: centerY + 190, type: 'defender', specificRole: 'RB_Wingback' },
                    { x: centerX - 140, y: centerY - 70, type: 'midfielder', specificRole: 'CM_BoxToBox' },
                    { x: centerX - 110, y: centerY, type: 'midfielder', specificRole: 'CM_Playmaker' },
                    { x: centerX - 140, y: centerY + 70, type: 'midfielder', specificRole: 'CM_BoxToBox' },
                    { x: centerX + 70, y: centerY - 200, type: 'attacker', specificRole: 'LW_Dribbler' },
                    { x: centerX + 130, y: centerY, type: 'attacker', specificRole: 'ST_Finisher' },
                    { x: centerX + 70, y: centerY + 200, type: 'attacker', specificRole: 'RW_Dribbler' }
                ]
            },
            "BarcelonaCity": {
                name: "Barcelona City",
                color: "#004D98",
                initialTactic: "equilibrado",
                initialPlayWidth: "wide",
                formation: [
                    { x: FIELD_MARGIN + 50, y: centerY, type: 'goalkeeper', specificRole: 'GK' },
                    { x: FIELD_MARGIN + 155, y: centerY - 190, type: 'defender', specificRole: 'LB_Wingback' },
                    { x: FIELD_MARGIN + 115, y: centerY - 70, type: 'defender', specificRole: 'CB_Stopper' },
                    { x: FIELD_MARGIN + 115, y: centerY + 70, type: 'defender', specificRole: 'CB_Stopper' },
                    { x: FIELD_MARGIN + 155, y: centerY + 190, type: 'defender', specificRole: 'RB_Wingback' },
                    { x: centerX - 150, y: centerY - 80, type: 'midfielder', specificRole: 'CM_Playmaker' },
                    { x: centerX - 110, y: centerY, type: 'midfielder', specificRole: 'CM_BoxToBox' },
                    { x: centerX - 150, y: centerY + 80, type: 'midfielder', specificRole: 'CM_BoxToBox' },
                    { x: centerX + 60, y: centerY - 200, type: 'attacker', specificRole: 'LW_Dribbler' },
                    { x: centerX + 120, y: centerY, type: 'attacker', specificRole: 'ST_Finisher' },
                    { x: centerX + 60, y: centerY + 200, type: 'attacker', specificRole: 'RW_Dribbler' }
                ]
            },
             "RojoGenerico": {
                name: "Rojos CF",
                color: "#E53E3E",
                initialTactic: "equilibrado",
                initialPlayWidth: "normal",
                formation: [
                    { x: FIELD_MARGIN + 50, y: centerY, type: 'goalkeeper', specificRole: 'GK' },
                    { x: FIELD_MARGIN + 150, y: centerY - 150, type: 'defender', specificRole: 'LB_Wingback' },
                    { x: FIELD_MARGIN + 100, y: centerY - 50, type: 'defender', specificRole: 'CB_Stopper' },
                    { x: FIELD_MARGIN + 100, y: centerY + 50, type: 'defender', specificRole: 'CB_Stopper' },
                    { x: FIELD_MARGIN + 150, y: centerY + 150, type: 'defender', specificRole: 'RB_Wingback' },
                    { x: centerX - 80, y: centerY - 100, type: 'midfielder', specificRole: 'CM_BoxToBox' },
                    { x: centerX - 80, y: centerY + 100, type: 'midfielder', specificRole: 'CM_Playmaker' },
                    { x: centerX + 0, y: centerY - 200, type: 'midfielder', specificRole: 'LW_Dribbler' },
                    { x: centerX + 0, y: centerY + 200, type: 'midfielder', specificRole: 'RW_Dribbler' },
                    { x: centerX + 100, y: centerY - 50, type: 'attacker', specificRole: 'ST_Finisher' },
                    { x: centerX + 100, y: centerY + 50, type: 'attacker', specificRole: 'ST_Finisher' }
                ]
            },
            "AzulGenerico": {
                name: "Azules FC",
                color: "#3182CE",
                initialTactic: "defensivo",
                initialPlayWidth: "narrow",
                formation: [
                    { x: FIELD_MARGIN + 50, y: centerY, type: 'goalkeeper', specificRole: 'GK' },
                    { x: FIELD_MARGIN + 150, y: centerY - 150, type: 'defender', specificRole: 'LB_Wingback' },
                    { x: FIELD_MARGIN + 100, y: centerY - 50, type: 'defender', specificRole: 'CB_Stopper' },
                    { x: FIELD_MARGIN + 100, y: centerY + 50, type: 'defender', specificRole: 'CB_Stopper' },
                    { x: FIELD_MARGIN + 150, y: centerY + 150, type: 'defender', specificRole: 'RB_Wingback' },
                    { x: centerX - 80, y: centerY - 100, type: 'midfielder', specificRole: 'CM_BoxToBox' },
                    { x: centerX - 80, y: centerY + 100, type: 'midfielder', specificRole: 'CM_Playmaker' },
                    { x: centerX + 0, y: centerY - 200, type: 'midfielder', specificRole: 'LW_Dribbler' },
                    { x: centerX + 0, y: centerY + 200, type: 'midfielder', specificRole: 'RW_Dribbler' },
                    { x: centerX + 100, y: centerY - 50, type: 'attacker', specificRole: 'ST_Finisher' },
                    { x: centerX + 100, y: centerY + 50, type: 'attacker', specificRole: 'ST_Finisher' }
                ]
            }
        };

        const urlParams = new URLSearchParams(window.location.search);


        function distance(x1, y1, x2, y2) { return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2); }
        function isSpaceOpen(x, y, allPlayers, ownTeam, forPlayer, checkRadiusMultiplier = 1) {
            if (x < FIELD_MARGIN + PLAYER_RADIUS || x > FIELD_WIDTH - FIELD_MARGIN - PLAYER_RADIUS || y < FIELD_MARGIN + PLAYER_RADIUS || y > FIELD_HEIGHT - FIELD_MARGIN - PLAYER_RADIUS) { return false; }
            for (const p of allPlayers) {
                if (p === forPlayer) continue;
                const d = distance(x, y, p.x, p.y);
                if (p.team !== ownTeam) { if (d < MIN_DIST_TO_OPPONENT_FOR_SPACE * checkRadiusMultiplier) return false; }
                else { if (ball && ball.heldBy === p && d < MIN_DIST_TO_TEAMMATE_FOR_SPACE * 1.5 * checkRadiusMultiplier) {} else if (d < MIN_DIST_TO_TEAMMATE_FOR_SPACE * checkRadiusMultiplier) return false; }
            }
            return true;
        }

        class Player {
            constructor(baseX, baseY, team, playerType, specificRole, teamColor) {
                this.baseX = baseX; this.baseY = baseY; this.x = baseX; this.y = baseY;
                this.radius = PLAYER_RADIUS; this.team = team; this.playerType = playerType;
                this.specificRole = specificRole;
                this.color = teamColor;
                this.vx = 0; this.vy = 0; this.hasBall = false;
                this.targetX = this.x; this.targetY = this.y;
                this.isMakingRun = false; this.isPrimaryPresser = false;
                this.isOfferingWallPass = false;
                this.isOfferingForThrowIn = false;
                this.isOfferingForFreeKickSupport = false;
                this.isMakingFlankRun = false;
                this.isMakingBoxRun = false;
                this.isMakingOffsideRun = false;
                this.isMakingRunForCross = false;
                this.isMakingOverlapRun = false;
                this.isRequestingDeepBall = false;
                this.isHoldingUpPlay = false;
                this.holdUpPlayTimer = 0;
                this.isPerformingEscapeDribble = false;
                this.escapeDribbleTimer = 0;
                this.id = Math.random().toString(36).substr(2, 9);
                this.lastTackleAttemptTime = 0;
                this.justWonBallTime = 0;
                this.decisionVariation = (Math.random() - 0.5) * 0.15;
                this.reactionTimeVariation = Math.random() * 5;
                this.framesToNextDecision = 0;
                this.framesHoldingBall = 0;
                this.stats = { goals: 0, assists: 0, shots: 0, passesAttempted: 0, passesCompleted: 0, recoveries: 0 };
                this.staminaMax = STAMINA_MAX_DEFAULT;
                if (this.specificRole === 'CM_BoxToBox') this.staminaMax *= 1.1;
                else if (this.playerType === 'attacker') this.staminaMax *= 0.95;
                this.staminaCurrent = this.staminaMax;
                this.fatigueFactor = 1.0;
            }
            draw() {
                ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill(); ctx.closePath();
                if (this.hasBall) { ctx.beginPath(); ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2); ctx.strokeStyle = '#F6E05E'; ctx.lineWidth = 2; ctx.stroke(); ctx.closePath(); }
                if (this.isRequestingDeepBall) {
                    ctx.fillStyle = 'yellow';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y - this.radius - 5, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.closePath();
                }
            }
            updateStamina() {
                if (gameState !== 'playing') {
                    this.staminaCurrent += STAMINA_RECOVERY_PASSIVE * 2;
                } else {
                    let staminaDrain = STAMINA_DECREASE_PASSIVE;
                    const speed = Math.sqrt(this.vx**2 + this.vy**2);
                    if (speed > MAX_PLAYER_SPEED * 0.6) {
                        staminaDrain += STAMINA_DECREASE_SPRINT;
                        if (this.hasBall) {
                            staminaDrain += STAMINA_DECREASE_DRIBBLING_SPRINT;
                        }
                    }
                    if (this.isPrimaryPresser || this.isMakingOffsideRun || this.isRequestingDeepBall || this.isMakingRunForCross || this.isPerformingEscapeDribble || this.isMakingOverlapRun) {
                        staminaDrain += STAMINA_DECREASE_PRESSING * 0.7;
                    }
                    if (this.myTeamTactic === 'ofensivo') {
                        staminaDrain *= 1.2;
                    }
                    this.staminaCurrent -= staminaDrain;

                    if (speed < MAX_PLAYER_SPEED * 0.1 && !this.hasBall) {
                        this.staminaCurrent += STAMINA_RECOVERY_PASSIVE;
                    }
                }
                this.staminaCurrent = Math.max(STAMINA_MIN_EFFECTIVE * 0.8, Math.min(this.staminaMax, this.staminaCurrent));
                const staminaRatio = this.staminaCurrent / this.staminaMax;
                if (staminaRatio < FATIGUE_EFFECT_ON_SPEED_THRESHOLD) {
                    const fatigueRange = FATIGUE_EFFECT_ON_SPEED_THRESHOLD - (STAMINA_MIN_EFFECTIVE / this.staminaMax);
                    const currentPosInRange = FATIGUE_EFFECT_ON_SPEED_THRESHOLD - staminaRatio;
                    this.fatigueFactor = 1.0 - ( (1.0 - MIN_SPEED_FATIGUE_FACTOR) * (currentPosInRange / fatigueRange) );
                    this.fatigueFactor = Math.max(MIN_SPEED_FATIGUE_FACTOR, this.fatigueFactor);
                } else {
                    this.fatigueFactor = 1.0;
                }
            }
            update(ball, allPlayers) {
                this.updateStamina();
                this.myTeamTactic = (this.team === 'A') ? teamA_tactic : teamB_tactic;
                this.myPlayWidth = (this.team === 'A') ? teamA_playWidth : teamB_playWidth;

                this.isMakingRun = false;
                this.isPrimaryPresser = false;
                this.isMakingFlankRun = false;
                this.isMakingBoxRun = false;
                this.isMakingOffsideRun = false;
                this.isOfferingForFreeKickSupport = false;
                this.isRequestingDeepBall = false;
                this.isMakingRunForCross = false;
                this.isMakingOverlapRun = false;


                if (this.escapeDribbleTimer > 0) {
                    this.escapeDribbleTimer--;
                    if (this.escapeDribbleTimer === 0) {
                        this.isPerformingEscapeDribble = false;
                    }
                }


                if (this.framesToNextDecision > 0) {
                    this.framesToNextDecision--;
                } else {
                    if (gameState === 'playing' || ((gameState.startsWith('preparing') || gameState === 'kickOff') && this.hasBall) ) {
                        this.decideAction(ball, allPlayers);
                    } else if (gameState.startsWith('preparing') || gameState === 'kickOff') {
                        this.positionForRestart(ball, allPlayers);
                    }
                    this.framesToNextDecision = this.reactionTimeVariation;
                }


                const dx = this.targetX - this.x; const dy = this.targetY - this.y; const distToTarget = distance(this.x, this.y, this.targetX, this.targetY);
                let currentMaxSpeed = MAX_PLAYER_SPEED * this.fatigueFactor;
                if(this.isPrimaryPresser && this.myTeamTactic === 'ofensivo') currentMaxSpeed *= 1.15;
                else if (this.isMakingRun || this.isOfferingWallPass || this.isOfferingForThrowIn || this.isMakingFlankRun || this.isMakingBoxRun || this.isHoldingUpPlay || this.isMakingOffsideRun || this.isOfferingForFreeKickSupport || this.isMakingRunForCross || this.isMakingOverlapRun) currentMaxSpeed *= 1.12;
                else if (this.playerType === 'defender' && distToTarget > 100 && this.myTeamTactic !== 'ofensivo') currentMaxSpeed *= 0.9;

                if (this.isPerformingEscapeDribble) {
                    currentMaxSpeed *= 1.18;
                } else if (this.isHoldingUpPlay) {
                    currentMaxSpeed *= 0.1;
                }

                if (distToTarget > 1) { this.vx = (dx / distToTarget) * currentMaxSpeed; this.vy = (dy / distToTarget) * currentMaxSpeed; }
                else { this.vx = 0; this.vy = 0; }

                this.x += this.vx; this.y += this.vy;
                if (gameState !== 'preparingThrowIn' || !this.hasBall) {
                    this.x = Math.max(this.radius + FIELD_MARGIN, Math.min(this.x, FIELD_WIDTH - this.radius - FIELD_MARGIN));
                    this.y = Math.max(this.radius + FIELD_MARGIN, Math.min(this.y, FIELD_HEIGHT - this.radius - FIELD_MARGIN));
                }

                allPlayers.forEach(otherPlayer => { if (this === otherPlayer) return; const d = distance(this.x, this.y, otherPlayer.x, otherPlayer.y); if (d < this.radius + otherPlayer.radius) { const overlap = (this.radius + otherPlayer.radius) - d; const angle = Math.atan2(this.y - otherPlayer.y, this.x - otherPlayer.x); const moveX = (overlap / 2) * Math.cos(angle); const moveY = (overlap / 2) * Math.sin(angle); this.x += moveX; this.y += moveY; otherPlayer.x -= moveX; otherPlayer.y -= moveY; } });

                const oldHasBall = this.hasBall;

                if (gameState === 'playing' && distance(this.x, this.y, ball.x, ball.y) < INTERCEPT_DISTANCE && !ball.isKicked) {
                    if (ball.isAirborne && ball.airborneTimer > 5) {
                        if (distance(this.x, this.y, ball.x, ball.y) < HEADER_ATTEMPT_RANGE && this.playerType !== 'goalkeeper') {
                            this.targetX = ball.x;
                            this.targetY = ball.y;
                        }
                    } else {
                        const now = Date.now();
                        if (!ball.heldBy) {
                            let canTake = true;
                            for(const p of allPlayers) { if (p.team === this.team && p !== this && distance(p.x, p.y, ball.x, ball.y) < distance(this.x, this.y, ball.x, ball.y) -1 ) { if (distance(p.x,p.y, ball.x,ball.y) < INTERCEPT_DISTANCE * 0.8) { canTake = false; break; } } }
                            if(canTake){
                                ball.heldBy = this; ball.lastTouchedBy = this; this.justWonBallTime = 0;
                                if (ball.isAirborne) {
                                    ball.isAirborne = false; ball.airborneTimer = 0; ball.shadowSizeFactor = 1;
                                    this.framesHoldingBall = -FRAMES_TO_SETTLE_BALL / 2;
                                }
                                if (ball.passData && ball.passData.passerTeam === this.team && this.id !== ball.passData.passerId && !ball.passData.isFromSetPiece) {
                                    const playerPositionAtPass = (this.team === 'A' ? ball.passData.teamAPositionsAtPass : ball.passData.teamBPositionsAtPass).find(p => p.id === this.id);
                                    const opponentPositionsAtPass = (this.team === 'A' ? ball.passData.teamBPositionsAtPass : ball.passData.teamAPositionsAtPass);
                                    const passer = allPlayers.find(p => p.id === ball.passData.passerId);
                                    if (playerPositionAtPass && isPlayerOffsideAtMomentOfPass(playerPositionAtPass, this.team, opponentPositionsAtPass, ball.passData.ballPositionX)) {
                                        ball.heldBy = null;
                                        handleOffside(this, playerPositionAtPass, allPlayers);
                                    } else if (passer) {
                                        passer.stats.passesCompleted++;
                                    }
                                }
                                if (ball.heldBy === this) ball.passData = null;
                            }
                        } else if (ball.heldBy.team !== this.team) {
                            if (now - this.lastTackleAttemptTime > TACKLE_COOLDOWN_MS * (this.fatigueFactor < 0.7 ? 1.5 : 1)) {
                                this.lastTackleAttemptTime = now;
                                const opponentLosingBall = ball.heldBy;
                                opponentLosingBall.lastTackleAttemptTime = now;
                                let foulCommitted = false;
                                const foulLocationX = opponentLosingBall.x; const foulLocationY = opponentLosingBall.y;
                                const oppMoveDx = opponentLosingBall.targetX - opponentLosingBall.x; const oppMoveDy = opponentLosingBall.targetY - opponentLosingBall.y;
                                if (Math.abs(oppMoveDx) > 1 || Math.abs(oppMoveDy) > 1) { const oppMoveAngle = Math.atan2(oppMoveDy, oppMoveDx); const angleToTackler = Math.atan2(this.y - opponentLosingBall.y, this.x - opponentLosingBall.x); let angleDiff = Math.abs(oppMoveAngle - angleToTackler); if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff; if (angleDiff > Math.PI * 0.70) { const tacklerSpeed = Math.sqrt(this.vx**2 + this.vy**2); if (tacklerSpeed > MAX_PLAYER_SPEED * 0.45 * this.fatigueFactor && Math.random() < FOUL_CHANCE_FROM_BEHIND) { foulCommitted = true; } } }
                                if (!foulCommitted) { const tacklerSpeed = Math.sqrt(this.vx**2 + this.vy**2); if (tacklerSpeed > MAX_PLAYER_SPEED * 0.80 * this.fatigueFactor && Math.random() < FOUL_CHANCE_RECKLESS) { foulCommitted = true; } }
                                if (foulCommitted && gameState === 'playing') { handleFoul(this, opponentLosingBall, foulLocationX, foulLocationY, allPlayers); ball.passData = null; }
                                else { opponentLosingBall.hasBall = false; ball.heldBy = this; ball.lastTouchedBy = this; this.justWonBallTime = now; this.stats.recoveries++; ball.passData = null; ball.isAirborne = false; ball.airborneTimer = 0; ball.shadowSizeFactor = 1; ball.vx += (Math.random() - 0.5) * 2; ball.vy += (Math.random() - 0.5) * 2; }
                            }
                        }
                    }
                }

                this.hasBall = (ball.heldBy === this);

                if (this.hasBall && !oldHasBall) {
                    this.framesHoldingBall = 0;
                } else if (this.hasBall) {
                    this.framesHoldingBall++;
                } else {
                    this.framesHoldingBall = 0;
                }

                if (this.hasBall) {
                    if (gameState === 'preparingThrowIn') {
                        ball.vx = 0; ball.vy = 0;
                    } else {
                        ball.x = this.x + (this.team === 'A' ? this.radius + ball.radius + 1 : -(this.radius + ball.radius + 1));
                        ball.y = this.y;
                        ball.vx = 0; ball.vy = 0;
                    }
                }
            }
            positionForRestart(ball, allPlayers){
                this.isMakingRun = false; this.isPrimaryPresser = false; this.isOfferingWallPass = false;
                this.isOfferingForFreeKickSupport = false;
                this.isMakingRunForCross = false;
                this.isMakingOverlapRun = false;

                if (this.hasBall) {
                    this.targetX = this.x;
                    this.targetY = this.y;
                    return;
                }

                if (gameState === 'preparingThrowIn') {
                    const throwInTaker = ball.heldBy;
                    if (throwInTaker && this.team === throwInTaker.team) {
                        if (this.isOfferingForThrowIn) {
                            const throwInSpotX = ball.x;
                            const throwInSpotY = ball.y;
                            let targetX = throwInSpotX;
                            let targetY = throwInSpotY;
                            const onFieldOffset = PLAYER_RADIUS * 4;
                            const spreadFactor = PLAYER_RADIUS * 8;
                            let offeringIndex = allPlayers.filter(p=>p.team === this.team && p.isOfferingForThrowIn && p.id < this.id).length;

                            if (throwInTaker.y <= FIELD_MARGIN + PLAYER_RADIUS) {
                                targetY = FIELD_MARGIN + onFieldOffset;
                                targetX = throwInTaker.x + (offeringIndex - 0.5 * (allPlayers.filter(p=>p.team === this.team && p.isOfferingForThrowIn).length -1) ) * spreadFactor ;
                            } else if (throwInTaker.y >= FIELD_HEIGHT - FIELD_MARGIN - PLAYER_RADIUS) {
                                targetY = FIELD_HEIGHT - FIELD_MARGIN - onFieldOffset;
                                 targetX = throwInTaker.x + (offeringIndex - 0.5 * (allPlayers.filter(p=>p.team === this.team && p.isOfferingForThrowIn).length -1) ) * spreadFactor ;
                            } else if (throwInTaker.x <= FIELD_MARGIN + PLAYER_RADIUS) {
                                targetX = FIELD_MARGIN + onFieldOffset;
                                targetY = throwInTaker.y + (offeringIndex - 0.5 * (allPlayers.filter(p=>p.team === this.team && p.isOfferingForThrowIn).length -1) ) * spreadFactor ;
                            } else {
                                targetX = FIELD_WIDTH - FIELD_MARGIN - onFieldOffset;
                                 targetY = throwInTaker.y + (offeringIndex - 0.5 * (allPlayers.filter(p=>p.team === this.team && p.isOfferingForThrowIn).length -1) ) * spreadFactor ;
                            }
                            this.targetX = Math.max(FIELD_MARGIN + this.radius, Math.min(targetX, FIELD_WIDTH - FIELD_MARGIN - this.radius));
                            this.targetY = Math.max(FIELD_MARGIN + this.radius, Math.min(targetY, FIELD_HEIGHT - FIELD_MARGIN - this.radius));
                        } else {
                             this.targetX = this.baseX + (this.team === 'A' ? 20 : -20);
                             this.targetY = this.baseY;
                        }
                    } else if (throwInTaker && this.team !== throwInTaker.team) {
                        if (this.playerType === 'goalkeeper') {
                            this.targetX = this.baseX;
                            this.targetY = this.baseY;
                            return;
                        }

                        const defendingOutfieldPlayers = allPlayers.filter(p => p.team === this.team && p.playerType !== 'goalkeeper');
                        defendingOutfieldPlayers.sort((a, b) => distance(a.x, a.y, ball.x, ball.y) - distance(b.x, b.y, ball.x, ball.y));
                        const designatedPressers = defendingOutfieldPlayers.slice(0, 2);

                        if (designatedPressers.includes(this)) {
                            const offeringPlayers = allPlayers.filter(p => p.team === throwInTaker.team && p.isOfferingForThrowIn);
                            let playerToMark = null;

                            if (offeringPlayers.length > 0) {
                                offeringPlayers.sort((a,b) => distance(a.x, a.y, ball.x, ball.y) - distance(b.x, b.y, ball.x, ball.y));
                                if (this === designatedPressers[0]) { playerToMark = offeringPlayers[0];}
                                else if (designatedPressers.length > 1 && this === designatedPressers[1]) { playerToMark = offeringPlayers.length > 1 ? offeringPlayers[1] : offeringPlayers[0];}
                            }

                            if (playerToMark) {
                                const angleToOwnGoal = Math.atan2( (this.team === 'A' ? centerY - playerToMark.y : centerY - playerToMark.y), (this.team === 'A' ? FIELD_MARGIN - playerToMark.x : (FIELD_WIDTH - FIELD_MARGIN) - playerToMark.x) );
                                this.targetX = playerToMark.x + Math.cos(angleToOwnGoal) * (PLAYER_RADIUS * 1.5);
                                this.targetY = playerToMark.y + Math.sin(angleToOwnGoal) * (PLAYER_RADIUS * 1.5);
                            } else {
                                const distFromThrowSpot = PLAYER_RADIUS * 7;
                                let angleOffset = (designatedPressers.indexOf(this) === 0) ? -Math.PI / 6 : Math.PI / 6;
                                let baseAngle = Math.atan2(centerY - ball.y, centerX - ball.x);
                                this.targetX = ball.x + Math.cos(baseAngle + angleOffset) * distFromThrowSpot;
                                this.targetY = ball.y + Math.sin(baseAngle + angleOffset) * distFromThrowSpot;
                            }
                        } else {
                            this.targetX = this.baseX;
                            this.targetY = this.baseY;
                        }
                    }
                } else if (gameState === 'preparingGoalKick') {
                    const kicker = ball.heldBy;
                    if (kicker && this.team === kicker.team) {
                        if (this.playerType === 'defender') {
                            this.targetX = this.baseX + (this.team === 'A' ? 40 : -40);
                            this.targetY = this.baseY + (this.y < centerY ? -30 : 30);
                        } else {
                            this.targetX = this.baseX + (this.team === 'A' ? 70 : -70);
                            this.targetY = this.baseY;
                        }
                     } else if (kicker && this.team !== kicker.team) {
                        let attackers = [];
                        let midfielders = [];
                        allPlayers.forEach(p => {
                            if (p.team === this.team) {
                                if (p.playerType === 'attacker') attackers.push(p);
                                else if (p.playerType === 'midfielder') midfielders.push(p);
                            }
                        });

                        let orderedPotentialPressers = [
                            ...attackers.sort((a,b) => {
                                const aClosenessToGoal = (a.team === 'A') ? (FIELD_WIDTH - FIELD_MARGIN - a.baseX) : (a.baseX - FIELD_MARGIN);
                                const bClosenessToGoal = (b.team === 'A') ? (FIELD_WIDTH - FIELD_MARGIN - b.baseX) : (b.baseX - FIELD_MARGIN);
                                return aClosenessToGoal - bClosenessToGoal;
                            }),
                            ...midfielders.sort((a,b) => {
                                const aClosenessToGoal = (a.team === 'A') ? (FIELD_WIDTH - FIELD_MARGIN - a.baseX) : (a.baseX - FIELD_MARGIN);
                                const bClosenessToGoal = (b.team === 'A') ? (FIELD_WIDTH - FIELD_MARGIN - b.baseX) : (b.baseX - FIELD_MARGIN);
                                return aClosenessToGoal - bClosenessToGoal;
                            })
                        ];

                        const designatedPressers = orderedPotentialPressers.slice(0, 2);

                        if (designatedPressers.includes(this)) {
                            const penaltyAreaFrontX = (kicker.team === 'A') ? (FIELD_MARGIN + 165) : (FIELD_WIDTH - FIELD_MARGIN - 165);
                            const bufferFromPenaltyArea = PLAYER_RADIUS * 6;

                            if (kicker.team === 'A') {
                                this.targetX = penaltyAreaFrontX + bufferFromPenaltyArea;
                            } else {
                                this.targetX = penaltyAreaFrontX - bufferFromPenaltyArea;
                            }

                            let yOffsetFactor = PLAYER_RADIUS * 8;
                            if (designatedPressers.length === 1 || designatedPressers.indexOf(this) === -1 ) {
                                 this.targetY = centerY;
                            } else {
                                 if (this.baseY < centerY - PLAYER_RADIUS * 2) this.targetY = centerY - yOffsetFactor;
                                 else if (this.baseY > centerY + PLAYER_RADIUS * 2) this.targetY = centerY + yOffsetFactor;
                                 else this.targetY = centerY + (designatedPressers.indexOf(this) === 0 ? -yOffsetFactor : yOffsetFactor);
                            }
                        } else {
                            this.targetX = this.baseX;
                            this.targetY = this.baseY;
                            const halfwayLine = centerX;
                            const defensiveBuffer = FIELD_WIDTH * 0.1;
                            if (this.team === 'A' && this.targetX > halfwayLine - defensiveBuffer) {
                                this.targetX = halfwayLine - defensiveBuffer - (Math.random() * PLAYER_RADIUS * 3);
                            } else if (this.team === 'B' && this.targetX < halfwayLine + defensiveBuffer) {
                                this.targetX = halfwayLine + defensiveBuffer + (Math.random() * PLAYER_RADIUS * 3);
                            }
                        }
                    } else {
                        this.targetX = this.baseX;
                        this.targetY = this.baseY;
                    }
                } else if (gameState === 'preparingCornerKick') { /* ... */ }
                else if (gameState === 'preparingFreeKick' || gameState === 'preparingFreeKickFoul') {
                    const kicker = ball.heldBy;
                    if (kicker && kicker.team === this.team) {
                        let supportPlayerDesignatedThisFrame = false;
                        const potentialSupporters = allPlayers.filter(p => p.team === this.team && p !== kicker && p.playerType !== 'goalkeeper')
                            .sort((a,b) => distance(a.x, a.y, kicker.x, kicker.y) - distance(b.x, b.y, kicker.x, kicker.y));

                        if (potentialSupporters.length > 0 && potentialSupporters[0] === this) {
                            let alreadySupporting = allPlayers.find(p => p.team === this.team && p !== this && p.isOfferingForFreeKickSupport);
                            if (!alreadySupporting) {
                                this.isOfferingForFreeKickSupport = true;
                                this.targetX = kicker.x + (this.x < kicker.x ? -FREEKICK_SUPPORT_PLAYER_DIST : FREEKICK_SUPPORT_PLAYER_DIST) * (Math.random()*0.4 + 0.8);
                                this.targetY = kicker.y + (Math.random() - 0.5) * FREEKICK_SUPPORT_PLAYER_DIST * 1.5;
                                supportPlayerDesignatedThisFrame = true;
                            }
                        }

                        if (!supportPlayerDesignatedThisFrame) {
                            this.targetX = this.baseX + (ball.x - this.baseX) * 0.2 + (this.team === 'A' ? 15 : -15) * (1 - (Math.abs(this.baseY - centerY) / (FIELD_HEIGHT/2))) ;
                            this.targetY = this.baseY + (ball.y - this.baseY) * 0.15;
                            if (this.myTeamTactic === 'ofensivo') {
                                this.targetX += (this.team === 'A' ? 30 : -30);
                            } else if (this.myTeamTactic === 'defensivo') {
                                this.targetX -= (this.team === 'A' ? 20 : -20);
                            }
                        }
                    } else if (kicker && kicker.team !== this.team) {
                        if (distance(this.x, this.y, ball.x, ball.y) < FREEKICK_WALL_DISTANCE + PLAYER_RADIUS * 3 && this.playerType !== 'goalkeeper') {
                            const angleToBall = Math.atan2(ball.y - this.y, ball.x - this.x);
                            this.targetX = ball.x - Math.cos(angleToBall) * FREEKICK_WALL_DISTANCE;
                            this.targetY = ball.y - Math.sin(angleToBall) * FREEKICK_WALL_DISTANCE;
                        } else {
                            this.targetX = this.baseX; this.targetY = this.baseY;
                        }
                    }
                } else if (gameState === 'kickOff') { this.resetToFormation(); }
                this.targetX = Math.max(FIELD_MARGIN + this.radius, Math.min(this.targetX, FIELD_WIDTH - FIELD_MARGIN - this.radius)); this.targetY = Math.max(FIELD_MARGIN + this.radius, Math.min(this.targetY, FIELD_HEIGHT - FIELD_MARGIN - this.radius));
            }

            decideAction(ball, allPlayers) {
                const opponentGoalX = this.team === 'A' ? FIELD_WIDTH - FIELD_MARGIN : FIELD_MARGIN;
                const ownGoalX = this.team === 'A' ? FIELD_MARGIN : FIELD_WIDTH - FIELD_MARGIN;
                const sidelineBuffer = 80;
                let attackSupportBonus = 0; let defensiveLineBonus = 0; let pressingIntensityFactor = 0.5;
                if (this.myTeamTactic === 'ofensivo') { defensiveLineBonus = (this.team === 'A' ? 60 : -60); attackSupportBonus = 60; pressingIntensityFactor = 0.75; }
                else if (this.myTeamTactic === 'defensivo') { defensiveLineBonus = (this.team === 'A' ? -60 : 60); attackSupportBonus = -50; pressingIntensityFactor = 0.3; }
                else { defensiveLineBonus = 0; attackSupportBonus = 30; pressingIntensityFactor = 0.55; }

                this.isOfferingWallPass = false;
                this.isMakingOffsideRun = false;
                this.isMakingFlankRun = false;
                this.isRequestingDeepBall = false;
                this.isMakingRunForCross = false;
                this.isMakingOverlapRun = false;


                if (this.hasBall && (gameState.startsWith('preparing') || gameState === 'kickOff')) {
                    let kickExecuted = false;
                    if (restartTimer > 0 && gameState !== 'kickOff') return;
                    if (gameState === 'kickOff' && restartTimer > 0 ) return;

                    if (gameState === 'preparingThrowIn') {
                        let offeringTeammates = allPlayers.filter(p => p.team === this.team && p !== this && p.isOfferingForThrowIn);
                        let bestTarget = null;
                        if (offeringTeammates.length > 0) {
                            let minScore = Infinity;
                            offeringTeammates.forEach(p => {
                                let distToReceiver = distance(this.x, this.y, p.x, p.y);
                                let opponentsNear = 0;
                                allPlayers.forEach(opp => {
                                    if (opp.team !== this.team && distance(p.x, p.y, opp.x, opp.y) < MARKING_DISTANCE_TIGHT * 1.2) {
                                        opponentsNear++;
                                    }
                                });
                                let score = distToReceiver + opponentsNear * 50;
                                if (score < minScore) {
                                    minScore = score;
                                    bestTarget = p;
                                }
                            });
                        }
                        if (bestTarget) {
                            this.kick(ball, bestTarget.x, bestTarget.y, THROW_IN_STRENGTH);
                        } else {
                            let targetX = this.x; let targetY = this.y;
                            if (this.y <= FIELD_MARGIN + this.radius + 1) targetY += PLAYER_RADIUS * 5;
                            else if (this.y >= FIELD_HEIGHT - FIELD_MARGIN - this.radius - 1) targetY -= PLAYER_RADIUS * 5;
                            else if (this.x <= FIELD_MARGIN + this.radius + 1) targetX += PLAYER_RADIUS * 5;
                            else targetX -= PLAYER_RADIUS * 5;
                            this.kick(ball, targetX, targetY, THROW_IN_STRENGTH * 0.8);
                        }
                        kickExecuted = true;
                    }
                    else if (gameState === 'preparingGoalKick') {
                        let targetXKick = centerX + (this.team === 'A' ? FIELD_WIDTH * 0.25 : -FIELD_WIDTH * 0.25);
                        let targetYKick = centerY + (Math.random() - 0.5) * FIELD_HEIGHT * 0.5;
                        this.kick(ball, targetXKick, targetYKick, GOALKEEPER_CLEARANCE_STRENGTH, Math.random() < 0.4);
                        kickExecuted = true;
                    }
                    else if (gameState === 'preparingCornerKick') {
                        let targetXKick = (this.team === 'A' ? FIELD_WIDTH - FIELD_MARGIN - 80 : FIELD_MARGIN + 80);
                        let targetYKick = centerY + (Math.random() - 0.5) * GOAL_WIDTH * 0.7;
                        this.kick(ball, targetXKick, targetYKick, CORNER_KICK_STRENGTH, true);
                        kickExecuted = true;
                    }
                    else if (gameState === 'preparingFreeKick' || gameState === 'preparingFreeKickFoul') {
                        let madeDecisionFK = false;
                        const distToGoal = distance(this.x, this.y, opponentGoalX, centerY);
                        const angleToGoalCenter = Math.atan2(centerY - this.y, opponentGoalX - this.x);
                        const isGoodAngle = Math.abs(this.y - centerY) < GOAL_WIDTH * 0.8;
                        let pressureOnKicker = 0;
                        allPlayers.forEach(opp => { if (opp.team !== this.team && distance(this.x, this.y, opp.x, opp.y) < PRESSURE_DISTANCE_ON_PASSER * 1.5) { pressureOnKicker++; } });

                        if (distToGoal < FREEKICK_SHOOT_RANGE_X && isGoodAngle && pressureOnKicker < 1 && Math.random() < FREEKICK_SHOOT_CHANCE_BASE) {
                            this.kick(ball, opponentGoalX, centerY + (Math.random() - 0.5) * GOAL_WIDTH * 0.6, FREE_KICK_SHOT_STRENGTH, Math.random() < 0.3);
                            madeDecisionFK = true;
                        }

                        if (!madeDecisionFK) {
                            let bestLongTarget = null; let highestLongScore = -Infinity;
                            allPlayers.forEach(p => {
                                if (p.team === this.team && p !== this && p.playerType !== 'goalkeeper') {
                                    const d = distance(this.x, this.y, p.x, p.y);
                                    if (d > PLAYER_RADIUS * 10 && d < FIELD_WIDTH * 0.6) {
                                        let score = 100 - d * 0.5;
                                        if (isSpaceOpen(p.x, p.y, allPlayers, p.team, p, 1.2)) score += 70;
                                        if ((this.team === 'A' && p.x > this.x + PLAYER_RADIUS * 5) || (this.team === 'B' && p.x < this.x - PLAYER_RADIUS * 5)) score += 40;
                                        if (p.isMakingRun || p.isMakingBoxRun || p.isMakingOffsideRun) score += 50;
                                        if (score > highestLongScore) { highestLongScore = score; bestLongTarget = p; }
                                    }
                                }
                            });
                            if (bestLongTarget && highestLongScore > 50) {
                                this.kick(ball, bestLongTarget.targetX, bestLongTarget.targetY, PASS_STRENGTH_LONG, Math.random() < CHANCE_FOR_HIGH_LONG_PASS);
                                madeDecisionFK = true;
                            }
                        }

                        if (!madeDecisionFK) {
                            const supportPlayer = allPlayers.find(p => p.team === this.team && p.isOfferingForFreeKickSupport);
                            if (supportPlayer && distance(this.x, this.y, supportPlayer.x, supportPlayer.y) < FREEKICK_SUPPORT_PLAYER_DIST * 1.5 && isSpaceOpen(supportPlayer.x, supportPlayer.y, allPlayers, this.team, supportPlayer, 0.8)) {
                                this.kick(ball, supportPlayer.x, supportPlayer.y, FREE_KICK_PASS_STRENGTH);
                                madeDecisionFK = true;
                            }
                        }

                        if (!madeDecisionFK) {
                             this.kick(ball, this.x + (this.team === 'A' ? 80 : -80), this.y + (Math.random()-0.5)*30, FREE_KICK_PASS_STRENGTH);
                        }
                        kickExecuted = true;
                    }

                    if(kickExecuted && gameState !== 'kickOff') {
                        ball.lastTouchedBy = this;
                        gameState = 'playing';
                        document.getElementById('gameStateDisplay').textContent = "Jugando";
                        document.getElementById('restartMessage').style.display = 'none';
                    } else if (!kickExecuted && gameState !== 'kickOff' && gameState.startsWith('preparing')) {
                        // console.warn("Player has ball in preparing state but did not execute kick:", this.id, gameState);
                    }
                    return;
                }

                if (this.playerType === 'goalkeeper') { this.targetX = ownGoalX + (this.team === 'A' ? 35 : -35); const ballInfluenceZoneX = this.team === 'A' ? centerX + 100 : centerX - 100; if ((this.team === 'A' && ball.x < ballInfluenceZoneX) || (this.team === 'B' && ball.x > ballInfluenceZoneX)) { this.targetY = Math.max(centerY - GOAL_WIDTH / 2 - 10, Math.min(ball.y, centerY + GOAL_WIDTH / 2 + 10)); } else { this.targetY = centerY; } if (this.hasBall) { let targetXKick = centerX + (this.team === 'A' ? FIELD_WIDTH * 0.20 : -FIELD_WIDTH * 0.20); let targetYKick = centerY + (Math.random() - 0.5) * FIELD_HEIGHT * 0.45; this.kick(ball, targetXKick, targetYKick, GOALKEEPER_CLEARANCE_STRENGTH, Math.random() < 0.5); } return; }

                let effectiveBallX = ball.x; let effectiveBallY = ball.y; const distToCurrentBall = distance(this.x, this.y, ball.x, ball.y); if (!ball.heldBy && (Math.abs(ball.vx) > 0.1 || Math.abs(ball.vy) > 0.1) && distToCurrentBall < FIELD_WIDTH / 3.5) { let canAnticipate = false; const ballMovingTowardsPlayerX = (this.team === 'A' && ball.vx > 0.1 && ball.x < this.x + PLAYER_RADIUS*2) || (this.team === 'B' && ball.vx < -0.1 && ball.x > this.x - PLAYER_RADIUS*2); const playerBehindBallX = (this.team === 'A' && this.x < ball.x) || (this.team === 'B' && this.x > ball.x); if(ballMovingTowardsPlayerX || playerBehindBallX || distToCurrentBall < INTERCEPT_DISTANCE * 2.5) { canAnticipate = true;} if (canAnticipate) { effectiveBallX = ball.x + ball.vx * BALL_PREDICTION_TIME; effectiveBallY = ball.y + ball.vy * BALL_PREDICTION_TIME; effectiveBallX = Math.max(FIELD_MARGIN + BALL_RADIUS, Math.min(effectiveBallX, FIELD_WIDTH - FIELD_MARGIN - BALL_RADIUS)); effectiveBallY = Math.max(FIELD_MARGIN + BALL_RADIUS, Math.min(effectiveBallY, FIELD_HEIGHT - FIELD_MARGIN - BALL_RADIUS)); } }
                const distToEffectiveBall = distance(this.x, this.y, effectiveBallX, effectiveBallY);
                const ballCarrier = allPlayers.find(p => p.hasBall);

                if (!ball.heldBy && distToEffectiveBall < TARGET_LOOSE_BALL_RANGE && !ball.isKicked) {
                    if (!ball.isAirborne || ball.airborneTimer < 5) {
                        this.targetX = effectiveBallX; this.targetY = effectiveBallY; this.isMakingRun = false; return;
                    }
                }

                if (this.hasBall) {
                    const now = Date.now();
                    const mustPass = this.justWonBallTime > 0 && (now - this.justWonBallTime < MUST_PASS_AFTER_TACKLE_DURATION_MS);
                    let madeDecision = false;

                    if (mustPass) {
                        let bestPassTarget = null; let highestScore = -Infinity;
                        allPlayers.forEach(p => { if (p.team === this.team && p !== this && p.playerType !== 'goalkeeper') { const distToPlayer = distance(this.x, this.y, p.x, p.y); let score = 100 - distToPlayer; if (isSpaceOpen(p.x, p.y, allPlayers, p.team, p)) score += 50; if (p.isMakingRun || p.isOfferingWallPass) score += 40; if (score > highestScore && distToPlayer < FIELD_WIDTH * 0.4 && distToPlayer > PLAYER_RADIUS * 2) { highestScore = score; bestPassTarget = p; } } });
                        if (bestPassTarget) { this.kick(ball, bestPassTarget.x, bestPassTarget.y, (bestPassTarget.isOfferingWallPass ? WALL_PASS_STRENGTH : PASS_STRENGTH_SHORT * 1.1)); this.justWonBallTime = 0; return; }
                        else { if (now - this.justWonBallTime > MUST_PASS_AFTER_TACKLE_DURATION_MS / 1.5) { this.justWonBallTime = 0;} }
                    }
                    if (this.justWonBallTime > 0 && (now - this.justWonBallTime >= MUST_PASS_AFTER_TACKLE_DURATION_MS)) {
                        this.justWonBallTime = 0;
                    }

                    if (!mustPass && this.framesHoldingBall < FRAMES_TO_SETTLE_BALL && gameState === 'playing') {
                        if (!this.isHoldingUpPlay) {
                            this.targetX = opponentGoalX;
                            if (this.y < FIELD_MARGIN + sidelineBuffer) this.targetY = centerY * 0.4 + (FIELD_MARGIN + sidelineBuffer + 30) * 0.6;
                            else if (this.y > FIELD_HEIGHT - FIELD_MARGIN - sidelineBuffer) this.targetY = centerY * 0.4 + (FIELD_HEIGHT - FIELD_MARGIN - sidelineBuffer - 30) * 0.6;
                            else this.targetY = centerY;
                        }
                        return;
                    } else {
                        let escapeDribbleChanceModified = ESCAPE_DRIBBLE_CHANCE;
                        if (this.specificRole.includes('Dribbler')) escapeDribbleChanceModified *= 2.5;
                        if (this.playerType === 'attacker') escapeDribbleChanceModified *= 1.5;

                        if (!madeDecision && !mustPass && Math.random() < escapeDribbleChanceModified && !this.isPerformingEscapeDribble) {
                            let opponentsNear = 0;
                            allPlayers.forEach(opp => { if (opp.team !== this.team && distance(this.x, this.y, opp.x, opp.y) < CONFRONTATION_DISTANCE_FOR_DRIBBLING * 1.2) { opponentsNear++; } });

                            if (opponentsNear <= 1 || (opponentsNear <=2 && this.myTeamTactic === 'ofensivo')) {
                                let dribbleDirX = this.team === 'A' ? 1 : -1;
                                let dribbleDirY = 0;
                                if (isSpaceOpen(this.x + dribbleDirX * ESCAPE_DRIBBLE_TARGET_DISTANCE, this.y, allPlayers, this.team, this, 1.5)) {
                                     dribbleDirY = (Math.random() - 0.5) * 0.3;
                                } else if (this.y < centerY && isSpaceOpen(this.x + dribbleDirX * ESCAPE_DRIBBLE_TARGET_DISTANCE * 0.7, this.y + ESCAPE_DRIBBLE_TARGET_DISTANCE * 0.7, allPlayers, this.team, this, 1.5)) {
                                    dribbleDirY = 0.7;
                                } else if (this.y >= centerY && isSpaceOpen(this.x + dribbleDirX * ESCAPE_DRIBBLE_TARGET_DISTANCE * 0.7, this.y - ESCAPE_DRIBBLE_TARGET_DISTANCE * 0.7, allPlayers, this.team, this, 1.5)) {
                                    dribbleDirY = -0.7;
                                } else {
                                    dribbleDirX = 0;
                                }

                                if (dribbleDirX !== 0) {
                                    const norm = Math.sqrt(dribbleDirX**2 + dribbleDirY**2);
                                    const finalDribbleX = this.x + (dribbleDirX / norm) * ESCAPE_DRIBBLE_TARGET_DISTANCE;
                                    const finalDribbleY = this.y + (dribbleDirY / norm) * ESCAPE_DRIBBLE_TARGET_DISTANCE;

                                    this.isPerformingEscapeDribble = true;
                                    this.escapeDribbleTimer = ESCAPE_DRIBBLE_DURATION_FRAMES;
                                    this.targetX = finalDribbleX;
                                    this.targetY = finalDribbleY;
                                    this.isMakingRun = true;
                                    this.kick(ball, this.x + (dribbleDirX / norm) * PLAYER_RADIUS * 2.5, this.y + (dribbleDirY / norm) * PLAYER_RADIUS * 2.5, ESCAPE_DRIBBLE_STRENGTH);
                                    madeDecision = true;
                                }
                            }
                        }


                        const distToGoalX = Math.abs(this.x - opponentGoalX);
                        const distToGoalYAbs = Math.abs(this.y - centerY);
                        let shootingDistXAdjust = 0;
                        if(this.myTeamTactic === 'ofensivo' && this.playerType === 'attacker') shootingDistXAdjust = -30;
                        if(this.specificRole === 'ST_Finisher') shootingDistXAdjust -=20;
                        const SHOOTING_DISTANCE_X_PLAYER = ((this.playerType === 'attacker') ? FIELD_WIDTH * 0.30 : FIELD_WIDTH * 0.38) + shootingDistXAdjust;

                        let pressureOnPasser = 0;
                        allPlayers.forEach(opp => { if (opp.team !== this.team && distance(this.x, this.y, opp.x, opp.y) < PRESSURE_DISTANCE_ON_PASSER) { pressureOnPasser++; } });

                        let shotChanceModifier = 0; if(this.specificRole === 'ST_Finisher') shotChanceModifier = 0.2;

                        const isWideForCross = (this.team === 'A' && this.x > FIELD_WIDTH * (1 - CROSSING_ZONE_X_DEPTH_FACTOR) && this.x < FIELD_WIDTH - FIELD_MARGIN - PLAYER_RADIUS*2) || (this.team === 'B' && this.x < FIELD_WIDTH * CROSSING_ZONE_X_DEPTH_FACTOR && this.x > FIELD_MARGIN + PLAYER_RADIUS*2);
                        const isInYCrossZone = (this.y < FIELD_MARGIN + CROSSING_ZONE_Y_BUFFER || this.y > FIELD_HEIGHT - FIELD_MARGIN - CROSSING_ZONE_Y_BUFFER);

                        if (!madeDecision && !mustPass && isWideForCross && isInYCrossZone && pressureOnPasser < 2 && (this.specificRole.includes('Wingback') || this.specificRole.includes('Winger') || (this.playerType === 'midfielder' && this.myTeamTactic === 'ofensivo'))) {
                            let crossTargets = [];
                            allPlayers.forEach(p => { if (p.team === this.team && p !== this && (p.specificRole === 'ST_Finisher' || p.playerType === 'attacker' || p.isMakingBoxRun || p.isMakingRunForCross)) { const targetInBoxX = (this.team === 'A' && p.x > opponentGoalX - GOAL_WIDTH*1.5 && p.x < opponentGoalX + GOAL_DEPTH) || (this.team === 'B' && p.x < opponentGoalX + GOAL_WIDTH*1.5 && p.x > opponentGoalX - GOAL_DEPTH); const targetInBoxY = Math.abs(p.y - centerY) < GOAL_WIDTH * 0.8; if (targetInBoxX && targetInBoxY && isSpaceOpen(p.x, p.y, allPlayers, p.team, p, 0.8)) { crossTargets.push(p); } } });

                            if (crossTargets.length > 0 && Math.random() < 0.75) {
                                const crossTargetPlayer = crossTargets[Math.floor(Math.random() * crossTargets.length)];
                                let crossTargetPointX, crossTargetPointY;
                                let isHighCrossAttempt = Math.random() < CHANCE_FOR_HIGH_CROSS;
                                if (Math.random() < CUT_BACK_CHANCE) {
                                    crossTargetPointX = opponentGoalX + (this.team === 'A' ? -CROSS_TARGET_BOX_DEPTH * 1.5 : CROSS_TARGET_BOX_DEPTH * 1.5);
                                    crossTargetPointY = centerY + (crossTargetPlayer.y - centerY) * 0.2 + (Math.random() - 0.5) * CROSS_TARGET_BOX_WIDTH * 0.5;
                                    isHighCrossAttempt = false;
                                } else {
                                    crossTargetPointX = opponentGoalX + (this.team === 'A' ? -CROSS_TARGET_BOX_DEPTH : CROSS_TARGET_BOX_DEPTH);
                                    crossTargetPointY = centerY + (crossTargetPlayer.y - centerY) * 0.6 + (Math.random() - 0.5) * CROSS_TARGET_BOX_WIDTH;
                                }
                                this.kick(ball, crossTargetPointX, crossTargetPointY, CROSS_STRENGTH, isHighCrossAttempt);
                                madeDecision = true;
                            }
                        }

                        if (!madeDecision && !mustPass && distToGoalX < SHOOTING_DISTANCE_X_PLAYER && distToGoalYAbs < FIELD_HEIGHT * 0.33 && pressureOnPasser < 2 && Math.random() > shotChanceModifier ) {
                            const angleToGoal = Math.atan2(centerY - this.y, opponentGoalX - this.x);
                            const playerAngle = Math.atan2(this.vy, this.vx || (this.team === 'A' ? 1 : -1));
                            let angleDifference = Math.abs(playerAngle - angleToGoal);
                            if (angleDifference > Math.PI) angleDifference = 2 * Math.PI - angleDifference;

                            if (angleDifference < Math.PI / 2.5) {
                                let shotTargetY = centerY + (Math.random() - 0.5) * GOAL_WIDTH * 0.5;
                                this.kick(ball, opponentGoalX, shotTargetY, SHOT_STRENGTH);
                                madeDecision = true;
                            }
                        }

                        if (!madeDecision && !mustPass) {
                            let bestPassTarget = null; let highestScore = -Infinity; let intendedPassType = 'short';
                            allPlayers.forEach(p => { if (p.team === this.team && p !== this && p.playerType !== 'goalkeeper') { const pDistToOppGoal = distance(p.x, p.y, opponentGoalX, centerY); const selfDistToOppGoal = distance(this.x, this.y, opponentGoalX, centerY); const distToPlayer = distance(this.x, this.y, p.x, p.y); let score = 0; let forwardBonus = 60; if (pressureOnPasser > 1) forwardBonus = 20; if (this.myTeamTactic === 'defensivo') forwardBonus *= 0.7; if (this.specificRole === 'CM_Playmaker') forwardBonus *= 1.1; if (pDistToOppGoal < selfDistToOppGoal + (pressureOnPasser > 0 ? 50 : 30) ) { score += forwardBonus; } else if (this.myTeamTactic === 'defensivo' && pDistToOppGoal < selfDistToOppGoal + 100) { score += forwardBonus * 0.5; } if (Math.abs(p.y - centerY) < Math.abs(this.y - centerY) + 80) score += 25; score -= distToPlayer * 0.5; if (this.myTeamTactic === 'defensivo' && distToPlayer > FIELD_WIDTH * 0.25) score -= distToPlayer * 0.4;
                                if (p.isRequestingDeepBall) score += 50;
                                if (p.specificRole === 'ST_Finisher' && p.isMakingOffsideRun) { score += 80; intendedPassType = 'through'; }
                                else if (p.isMakingRun && isSpaceOpen(p.targetX, p.targetY, allPlayers, p.team, p)) {
                                    score += 70; intendedPassType = 'through';
                                    if(p.specificRole.includes('Winger') && !p.isMakingFlankRun) score +=15;
                                }
                                if (p.isMakingFlankRun && (p.specificRole.includes('Winger') || p.specificRole.includes('Wingback'))) {
                                    score += 60; intendedPassType = 'to_flank';
                                }
                                if (p.isOfferingWallPass) {score += 65; intendedPassType = 'wall';}
                                if(distToPlayer > FIELD_WIDTH * 0.3 && pressureOnPasser < 1 && (this.specificRole === 'CM_Playmaker' || this.myTeamTactic === 'ofensivo')) {score += 30; intendedPassType = 'long';}

                                let passLandingX = p.x + p.vx * (distToPlayer / (PASS_STRENGTH_SHORT*0.8));
                                let passLandingY = p.y + p.vy * (distToPlayer / (PASS_STRENGTH_SHORT*0.8));
                                if (!isSpaceOpen(passLandingX, passLandingY, allPlayers, p.team, p, 0.7)) score -= 60;


                                let opponentsNearReceiver = 0; allPlayers.forEach(opp => { if (opp.team !== p.team && distance(p.x, p.y, opp.x, opp.y) < MARKING_DISTANCE_TIGHT * 1.3) { opponentsNearReceiver++; } }); score -= opponentsNearReceiver * 35;  const isReceiverOrientedForward = (p.team === 'A' && (p.targetX > p.x + 3 || p.vx > 0.05)) || (p.team === 'B' && (p.targetX < p.x - 3 || p.vx < -0.05)); if (isReceiverOrientedForward) score += 30; const spaceInFrontX = p.x + (p.team === 'A' ? PLAYER_RADIUS * 6 : -PLAYER_RADIUS * 6); if (isSpaceOpen(spaceInFrontX, p.y, allPlayers, p.team, p)) score += 25; let tacticalMultiplier = 1.0; if (this.myTeamTactic === 'defensivo') tacticalMultiplier = 0.80; else if (this.myTeamTactic === 'ofensivo') tacticalMultiplier = 1.15; if (pressureOnPasser > 0) tacticalMultiplier *= (pressureOnPasser > 1 ? 0.6 : 0.8); score *= tacticalMultiplier; if (score > highestScore && distToPlayer < FIELD_WIDTH * 0.60 && distToPlayer > PLAYER_RADIUS * 2.5) { highestScore = score; bestPassTarget = p; } } });
                            let passAttemptThreshold = -15;
                            if(this.myTeamTactic === 'defensivo') passAttemptThreshold = -5;
                            if(pressureOnPasser > 0) passAttemptThreshold += pressureOnPasser * 10;
                            let passChance = 0.70; if(this.myTeamTactic === 'defensivo') passChance = 0.80; if(this.myTeamTactic === 'ofensivo') passChance = 0.65; if (pressureOnPasser > 0) passChance -= pressureOnPasser * 0.20; if (this.specificRole === 'CM_Playmaker') passChance = Math.min(0.95, passChance + 0.20); if (this.specificRole === 'CB_Stopper') passChance = Math.min(0.9, passChance + 0.15); passChance = Math.max(0.15, passChance);
                            if (bestPassTarget && highestScore > passAttemptThreshold && Math.random() < passChance) {
                                let passTargetX = bestPassTarget.x; let passTargetY = bestPassTarget.y; let passStrength = PASS_STRENGTH_SHORT;
                                let isHighPass = false;
                                if(bestPassTarget.isOfferingWallPass) {passStrength = WALL_PASS_STRENGTH;}
                                else if (bestPassTarget.specificRole === 'ST_Finisher' && bestPassTarget.isMakingOffsideRun) {
                                    passTargetX = bestPassTarget.targetX;
                                    passTargetY = bestPassTarget.targetY;
                                    passStrength = PASS_STRENGTH_THROUGH;
                                    if (distance(this.x, this.y, passTargetX, passTargetY) > FIELD_WIDTH * 0.25) {
                                        passStrength = PASS_STRENGTH_LONG;
                                        isHighPass = Math.random() < CHANCE_FOR_HIGH_LONG_PASS;
                                    }
                                }
                                else if (bestPassTarget.isMakingRun) {
                                    passTargetX = bestPassTarget.targetX; passTargetY = bestPassTarget.targetY; passStrength = PASS_STRENGTH_THROUGH;
                                    if (distance(this.x, this.y, passTargetX, passTargetY) > FIELD_WIDTH * 0.20) {
                                        isHighPass = Math.random() < CHANCE_FOR_HIGH_LONG_PASS * 0.5;
                                    }
                                }
                                else if (bestPassTarget.isMakingFlankRun) {
                                    passTargetX = bestPassTarget.targetX; passTargetY = bestPassTarget.targetY;
                                    passStrength = PASS_STRENGTH_SHORT * 1.2;
                                    isHighPass = Math.random() < CHANCE_FOR_HIGH_CROSS * 0.3;
                                }
                                else if (distance(this.x, this.y, bestPassTarget.x, bestPassTarget.y) > FIELD_WIDTH * 0.28 && pressureOnPasser < 1) {
                                    passStrength = PASS_STRENGTH_LONG; passTargetX = bestPassTarget.x + (bestPassTarget.team === 'A' ? 15 : -15);
                                    isHighPass = Math.random() < CHANCE_FOR_HIGH_LONG_PASS;
                                }
                                this.kick(ball, passTargetX, passTargetY, passStrength, isHighPass);
                                this.justWonBallTime = 0; madeDecision = true;
                            }
                        }
                        if (!madeDecision && !mustPass) {
                            let dribbleAttempted = false; let baseDribbleChance = 0.1;
                            if(this.playerType === 'attacker') baseDribbleChance = 0.3;
                            else if(this.playerType === 'midfielder') baseDribbleChance = 0.2;
                            if(this.specificRole === 'LW_Dribbler' || this.specificRole === 'RW_Dribbler') baseDribbleChance = 0.6;
                            else if(this.specificRole === 'CM_Playmaker' || this.specificRole === 'CB_Stopper') baseDribbleChance = 0.02;
                            const dribbleAttemptChance = baseDribbleChance + (this.myTeamTactic === 'ofensivo' ? 0.15 : 0) - (pressureOnPasser * 0.15) - (this.myTeamTactic === 'defensivo' ? 0.1 : 0) ;
                            if (this.playerType !== 'defender' || this.specificRole.includes('Wingback')) {
                                if (Math.random() < Math.max(0, dribbleAttemptChance) ) {
                                    let closestOpponent = null; let minDistToOpponent = CONFRONTATION_DISTANCE_FOR_DRIBBLING;
                                    allPlayers.forEach(opp => { if (opp.team !== this.team) { const d = distance(this.x, this.y, opp.x, opp.y); if (d < minDistToOpponent) { minDistToOpponent = d; closestOpponent = opp; } } });
                                    if (closestOpponent) {
                                        const dx_po = closestOpponent.x - this.x; const dy_po = closestOpponent.y - this.y; const dist_po = Math.sqrt(dx_po*dx_po + dy_po*dy_po);
                                        if (dist_po > 0) {
                                            const nx_po = dx_po / dist_po;  const ny_po = dy_po / dist_po;
                                            const targetLeftX = this.x - ny_po * DRIBBLING_SIDE_STEP_DIST + nx_po * DRIBBLING_FORWARD_STEP_DIST;
                                            const targetLeftY = this.y + nx_po * DRIBBLING_SIDE_STEP_DIST + ny_po * DRIBBLING_FORWARD_STEP_DIST;
                                            const targetRightX = this.x + ny_po * DRIBBLING_SIDE_STEP_DIST + nx_po * DRIBBLING_FORWARD_STEP_DIST;
                                            const targetRightY = this.y - nx_po * DRIBBLING_SIDE_STEP_DIST + ny_po * DRIBBLING_FORWARD_STEP_DIST;
                                            const spaceLeftOpen = isSpaceOpen(targetLeftX, targetLeftY, allPlayers, this.team, this);
                                            const spaceRightOpen = isSpaceOpen(targetRightX, targetRightY, allPlayers, this.team, this);
                                            let chosenDribbleX, chosenDribbleY;
                                            if (spaceLeftOpen && !spaceRightOpen) { chosenDribbleX = targetLeftX; chosenDribbleY = targetLeftY; }
                                            else if (spaceRightOpen && !spaceLeftOpen) { chosenDribbleX = targetRightX; chosenDribbleY = targetRightY; }
                                            else if (spaceLeftOpen && spaceRightOpen) { const leftAdvantage = (this.team === 'A' ? targetLeftX - this.x : this.x - targetLeftX); const rightAdvantage = (this.team === 'A' ? targetRightX - this.x : this.x - targetRightX); if (leftAdvantage > rightAdvantage) {chosenDribbleX = targetLeftX; chosenDribbleY = targetLeftY;} else {chosenDribbleX = targetRightX; chosenDribbleY = targetRightY;} }
                                            if (chosenDribbleX !== undefined) { this.targetX = chosenDribbleX; this.targetY = chosenDribbleY; this.isMakingRun = true; madeDecision = true; }
                                        }
                                    }
                                }
                            }
                            if (!madeDecision && pressureOnPasser > 1 && (this.myTeamTactic === 'defensivo' || this.specificRole === 'CB_Stopper')) {
                                let kickDirX = this.x + (this.team === 'A' ? 70 : -70);
                                let kickDirY = this.y + (Math.random() < 0.5 ? -FIELD_HEIGHT*0.2 : FIELD_HEIGHT*0.2);
                                this.kick(ball, kickDirX, kickDirY, PASS_STRENGTH_SHORT); this.justWonBallTime = 0; madeDecision = true;
                            }
                        }
                        if (!madeDecision && !this.isHoldingUpPlay) {
                             this.targetX = opponentGoalX;
                             if (this.y < FIELD_MARGIN + sidelineBuffer) this.targetY = centerY * 0.4 + (FIELD_MARGIN + sidelineBuffer + 30) * 0.6;
                             else if (this.y > FIELD_HEIGHT - FIELD_MARGIN - sidelineBuffer) this.targetY = centerY * 0.4 + (FIELD_HEIGHT - FIELD_MARGIN - sidelineBuffer - 30) * 0.6;
                             else this.targetY = centerY;
                        }
                    }
                    return;
                }
                else {  // Player does NOT have the ball
                    const isDefending = ballCarrier && ballCarrier.team !== this.team;
                    const isOwnTeamAttacking = ballCarrier && ballCarrier.team === this.team;
                    let actionDecided = false;

                    if (isDefending && ballCarrier) {
                        let distToBallCarrier = distance(this.x, this.y, ballCarrier.x, ballCarrier.y);
                        let closestPresserDist = Infinity; let designatedPrimaryPresser = null;
                        allPlayers.forEach(p => { if (p.team === this.team && p.playerType !== 'goalkeeper') { const d = distance(p.x, p.y, ballCarrier.x, ballCarrier.y); if (d < closestPresserDist) { closestPresserDist = d; designatedPrimaryPresser = p; } } });
                        this.isPrimaryPresser = (designatedPrimaryPresser === this && distToBallCarrier < FIELD_WIDTH / 2.5);

                        if (this.isPrimaryPresser) {
                            this.targetX = ballCarrier.x; this.targetY = ballCarrier.y;
                            if(this.myTeamTactic === 'ofensivo' && distToBallCarrier < PLAYER_RADIUS * 8){ this.targetX = ballCarrier.x - (ballCarrier.x - this.x) * 0.2 ; }
                            actionDecided = true;
                        } else {
                            let secondaryActionTaken = false;
                            if ((this.myTeamTactic === 'ofensivo' || this.myTeamTactic === 'equilibrado') && distToBallCarrier < PASS_LANE_COVER_DISTANCE && (this.playerType !== 'defender' || distToBallCarrier < FIELD_WIDTH / 4.5 || this.specificRole.includes('Wingback'))) {
                                let potentialReceivers = [];
                                allPlayers.forEach(opp => { if (opp.team === ballCarrier.team && opp !== ballCarrier) { let dangerRating = distance(ballCarrier.x, ballCarrier.y, opp.x, opp.y); if ((ballCarrier.team === 'A' && opp.x > ballCarrier.x) || (ballCarrier.team === 'B' && opp.x < ballCarrier.x)) { dangerRating *= 0.7; } potentialReceivers.push({player: opp, rating: dangerRating, id: opp.id }); } });
                                potentialReceivers.sort((a,b) => a.rating - b.rating);
                                if (potentialReceivers.length > 0) {
                                    const receiverToCover = potentialReceivers[0].player;
                                    let laneAlreadyCovered = false;
                                    for (const teammate of allPlayers) { if (teammate.team === this.team && teammate !== this && !teammate.isPrimaryPresser) { const tmToLaneMid = distance(teammate.targetX, teammate.targetY, (ballCarrier.x + receiverToCover.x) / 2, (ballCarrier.y + receiverToCover.y) / 2); const selfToLaneMid = distance(this.x, this.y, (ballCarrier.x + receiverToCover.x) / 2, (ballCarrier.y + receiverToCover.y) / 2); if (tmToLaneMid < selfToLaneMid && tmToLaneMid < PLAYER_RADIUS * 4) { laneAlreadyCovered = true; break; } } }
                                    if (!laneAlreadyCovered) { this.targetX = (ballCarrier.x + receiverToCover.x) / 2; this.targetY = (ballCarrier.y + receiverToCover.y) / 2; this.targetX += (ownGoalX - this.targetX) * 0.25; this.targetY += (centerY - this.targetY) * 0.15; if (distance(this.targetX, this.targetY, ballCarrier.x, ballCarrier.y) < PLAYER_RADIUS * 3) { const angleAwayFromCarrier = Math.atan2(this.targetY - ballCarrier.y, this.targetX - ballCarrier.x); this.targetX = ballCarrier.x + Math.cos(angleAwayFromCarrier) * PLAYER_RADIUS * 3.5; this.targetY = ballCarrier.y + Math.sin(angleAwayFromCarrier) * PLAYER_RADIUS * 3.5; } secondaryActionTaken = true; }
                                }
                            }
                            if (!secondaryActionTaken) {
                                let opponentToMark = null; let minScore = Infinity;
                                allPlayers.forEach(opp => { if (opp.team !== this.team && opp !== ballCarrier) { const distToOpp = distance(this.x, this.y, opp.x, opp.y); if (distToOpp < FIELD_WIDTH / 2.8) { let isOppMarkedByCloserTeammate = false; for(const teammate of allPlayers) { if(teammate.team === this.team && teammate !== this && distance(teammate.x, teammate.y, opp.x, opp.y) < distToOpp - PLAYER_RADIUS) { isOppMarkedByCloserTeammate = true; break; } } if (!isOppMarkedByCloserTeammate) { const dangerScore = distance(opp.x, opp.y, ownGoalX, centerY) * 0.8 + distToOpp * 0.2; if (dangerScore < minScore) { minScore = dangerScore; opponentToMark = opp; } } } } });
                                if (opponentToMark) { const markDist = (this.myTeamTactic === 'defensivo' || this.specificRole === 'CB_Stopper' ? MARKING_DISTANCE_LOOSE : MARKING_DISTANCE_TIGHT); const angleToOppFromGoal = Math.atan2(opponentToMark.y - ownGoalX, opponentToMark.x - ownGoalX); this.targetX = opponentToMark.x - Math.cos(angleToOppFromGoal) * markDist; this.targetY = opponentToMark.y - Math.sin(angleToOppFromGoal) * markDist; secondaryActionTaken = true; }
                            }
                            actionDecided = secondaryActionTaken;
                        }
                    }

                    if (!actionDecided) {
                        let idealZoneCenterX = this.baseX;
                        let idealZoneCenterY = this.baseY;
                        let currentTeamPlayWidth = this.myPlayWidth;
                        let currentTeamTactic = this.myTeamTactic;

                        let tacticalXShift = 0;
                        if (currentTeamTactic === 'ofensivo') tacticalXShift = attackSupportBonus * (this.team === 'A' ? 0.8 : -0.8);
                        else if (currentTeamTactic === 'defensivo') tacticalXShift = defensiveLineBonus * (this.team === 'A' ? 0.8 : -0.8);
                        else tacticalXShift = attackSupportBonus * (this.team === 'A' ? 0.5 : -0.5);
                        idealZoneCenterX += tacticalXShift;

                        const Y_WIDTH_ADJUST_FACTOR_WINGER = FIELD_HEIGHT * 0.15;
                        const Y_WIDTH_ADJUST_FACTOR_WINGBACK = FIELD_HEIGHT * 0.1;
                        const NARROW_PLAY_X_OFFSET_MIDFIELD = FIELD_WIDTH * 0.05;
                        const NARROW_PLAY_X_OFFSET_ATTACK = FIELD_WIDTH * 0.04;
                        let yInfluenceFromBall = 0.3;


                        if (this.specificRole.includes('Winger')) {
                            if (currentTeamPlayWidth === 'wide') {
                                idealZoneCenterY = (this.baseY < centerY) ? FIELD_MARGIN + SIDELINE_HUG_BUFFER : FIELD_HEIGHT - FIELD_MARGIN - SIDELINE_HUG_BUFFER;
                                yInfluenceFromBall = 0.01;
                            } else if (currentTeamPlayWidth === 'narrow') {
                                idealZoneCenterY = this.baseY + ((this.baseY < centerY) ? Y_WIDTH_ADJUST_FACTOR_WINGER * 1.7 : -Y_WIDTH_ADJUST_FACTOR_WINGER * 1.7);
                                yInfluenceFromBall = 0.45;
                            } else {
                                idealZoneCenterY = this.baseY;
                                yInfluenceFromBall = 0.20;
                            }
                        } else if (this.specificRole.includes('Wingback')) {
                            if (currentTeamPlayWidth === 'wide') {
                                idealZoneCenterY = (this.baseY < centerY) ? Math.max(FIELD_MARGIN + SIDELINE_HUG_BUFFER, this.baseY - Y_WIDTH_ADJUST_FACTOR_WINGBACK * 0.5)
                                                                     : Math.min(FIELD_HEIGHT - FIELD_MARGIN - SIDELINE_HUG_BUFFER, this.baseY + Y_WIDTH_ADJUST_FACTOR_WINGBACK * 0.5);
                                yInfluenceFromBall = 0.05;
                            } else if (currentTeamPlayWidth === 'narrow') {
                                idealZoneCenterY = this.baseY + ((this.baseY < centerY) ? Y_WIDTH_ADJUST_FACTOR_WINGBACK * 0.9 : -Y_WIDTH_ADJUST_FACTOR_WINGBACK*0.9);
                                yInfluenceFromBall = 0.4;
                            } else {
                                idealZoneCenterY = this.baseY;
                                yInfluenceFromBall = 0.25;
                            }
                        } else if (this.playerType === 'midfielder' && !this.specificRole.includes('Wing')) {
                            if (currentTeamPlayWidth === 'narrow') {
                                idealZoneCenterX += (this.baseX < centerX ? NARROW_PLAY_X_OFFSET_MIDFIELD : -NARROW_PLAY_X_OFFSET_MIDFIELD);
                            } else if (currentTeamPlayWidth === 'wide') {
                                idealZoneCenterX -= (this.baseX < centerX ? NARROW_PLAY_X_OFFSET_MIDFIELD * 0.3 : -NARROW_PLAY_X_OFFSET_MIDFIELD * 0.3);
                            }
                            idealZoneCenterY = this.baseY;
                            yInfluenceFromBall = 0.4;
                        } else if (this.playerType === 'attacker' && this.specificRole === 'ST_Finisher') {
                             idealZoneCenterY = centerY;
                             if (currentTeamPlayWidth === 'narrow') {
                                idealZoneCenterX += (this.baseX < centerX ? NARROW_PLAY_X_OFFSET_ATTACK : -NARROW_PLAY_X_OFFSET_ATTACK);
                            }
                             yInfluenceFromBall = 0.3;
                        } else {
                             idealZoneCenterY = this.baseY;
                             yInfluenceFromBall = 0.4;
                        }
                        idealZoneCenterY = idealZoneCenterY * (1 - yInfluenceFromBall) + effectiveBallY * yInfluenceFromBall;
                        idealZoneCenterX = idealZoneCenterX * 0.65 + effectiveBallX * 0.35;

                        idealZoneCenterX = Math.max(FIELD_MARGIN + PLAYER_RADIUS, Math.min(idealZoneCenterX, FIELD_WIDTH - FIELD_MARGIN - PLAYER_RADIUS));
                        idealZoneCenterY = Math.max(FIELD_MARGIN + PLAYER_RADIUS, Math.min(idealZoneCenterY, FIELD_HEIGHT - FIELD_MARGIN - PLAYER_RADIUS));


                        let zoneToleranceX = FIELD_WIDTH * MAX_ALLOWED_DIST_FROM_BASE_ZONE_X_FACTOR;
                        let zoneToleranceY = FIELD_HEIGHT * MAX_ALLOWED_DIST_FROM_BASE_ZONE_Y_FACTOR;
                        if (currentTeamPlayWidth === 'narrow') {
                            if (!this.specificRole.includes('Winger') && !this.specificRole.includes('Wingback')) zoneToleranceX *= 0.7;
                            else zoneToleranceY *= 0.8;
                        } else if (currentTeamPlayWidth === 'wide') {
                            if (this.specificRole.includes('Winger') || this.specificRole.includes('Wingback')) zoneToleranceY *= 0.7;
                        }


                        if (this.playerType === 'defender' && !this.specificRole.includes('Wingback')) { zoneToleranceX *= 0.5; zoneToleranceY *= 0.5; }
                        else if (this.specificRole.includes('Wingback')) { zoneToleranceY *= 1.4; zoneToleranceX *= 0.8; }
                        else if (this.specificRole === 'CM_Playmaker') { zoneToleranceX *= 0.6; zoneToleranceY *= 0.7;}
                        else if (this.specificRole.includes('Winger')) { zoneToleranceX *= 1.1; zoneToleranceY *= 0.4; }
                        else if (this.specificRole === 'ST_Finisher') { zoneToleranceY = GOAL_WIDTH * 0.7; idealZoneCenterY = centerY; zoneToleranceX *= 0.5;}
                        if (this.myTeamTactic === 'defensivo') { zoneToleranceX *= 0.6; zoneToleranceY *= 0.6;}
                        if (this.myTeamTactic === 'ofensivo') { zoneToleranceX *= 1.3; zoneToleranceY *= 1.3;}

                        const zoneMinX = idealZoneCenterX - zoneToleranceX; const zoneMaxX = idealZoneCenterX + zoneToleranceX;
                        const zoneMinY = idealZoneCenterY - zoneToleranceY; const zoneMaxY = idealZoneCenterY + zoneToleranceY;
                        let isOutOfZone = (this.x < zoneMinX || this.x > zoneMaxX || this.y < zoneMinY || this.y > zoneMaxY);

                        if (!this.isPrimaryPresser && !this.isMakingRun && !this.isOfferingWallPass) {
                            let specificRunTaken = false;
                            if (isOwnTeamAttacking) {
                                if (ballCarrier && (this.specificRole === 'ST_Finisher' || this.specificRole === 'CM_BoxToBox' || (this.playerType === 'attacker' && !this.specificRole.includes('Winger')))) {
                                    const isCrosserWide = (ballCarrier.team === 'A' && ballCarrier.x > FIELD_WIDTH * (1 - CROSSING_ZONE_X_DEPTH_FACTOR * 1.2) && (ballCarrier.y < FIELD_MARGIN + CROSSING_ZONE_Y_BUFFER * 1.5 || ballCarrier.y > FIELD_HEIGHT - FIELD_MARGIN - CROSSING_ZONE_Y_BUFFER*1.5) ) ||
                                                          (ballCarrier.team === 'B' && ballCarrier.x < FIELD_WIDTH * (CROSSING_ZONE_X_DEPTH_FACTOR * 1.2) && (ballCarrier.y < FIELD_MARGIN + CROSSING_ZONE_Y_BUFFER*1.5 || ballCarrier.y > FIELD_HEIGHT - FIELD_MARGIN - CROSSING_ZONE_Y_BUFFER*1.5) );
                                    if (isCrosserWide && Math.random() < CHANCE_PLAYER_MAKES_CROSS_RUN) {
                                        this.isMakingRunForCross = true;
                                        this.isMakingRun = true;
                                        this.isRequestingDeepBall = true;
                                        this.targetX = opponentGoalX + (this.team === 'A' ? -CROSS_TARGET_BOX_DEPTH : CROSS_TARGET_BOX_DEPTH) + (Math.random() -0.5) * PLAYER_RADIUS * 3;
                                        this.targetY = centerY + (Math.random() - 0.5) * CROSS_TARGET_BOX_WIDTH;
                                        actionDecided = true; specificRunTaken = true;
                                    }
                                }


                                if (!actionDecided && (this.specificRole.includes('Winger') || this.specificRole.includes('Wingback'))) {
                                    if (Math.random() < WINGER_RUN_WIDE_CHANCE && ballCarrier && this.myPlayWidth === 'wide') {
                                        const carrierAdvancing = (ballCarrier.team === 'A' && ballCarrier.vx > 0.05 && ballCarrier.x > centerX - FIELD_WIDTH *0.3) || (ballCarrier.team === 'B' && ballCarrier.vx < -0.05 && ballCarrier.x < centerX + FIELD_WIDTH*0.3);
                                        const wingerInAttackingHalf = (this.team === 'A' && this.x > centerX - FIELD_WIDTH * 0.15) || (this.team === 'B' && this.x < centerX + FIELD_WIDTH * 0.15);
                                        if (carrierAdvancing && wingerInAttackingHalf) {
                                            let targetRunX = this.x + (opponentGoalX - this.x) * 0.6;
                                            targetRunX = (this.team === 'A') ? Math.min(targetRunX, opponentGoalX - PLAYER_RADIUS * 4) : Math.max(targetRunX, opponentGoalX + PLAYER_RADIUS * 4);
                                            let targetRunY = (this.baseY < centerY) ? FIELD_MARGIN + SIDELINE_HUG_BUFFER : FIELD_HEIGHT - FIELD_MARGIN - SIDELINE_HUG_BUFFER;

                                            if (isSpaceOpen(targetRunX, targetRunY, allPlayers, this.team, this, 1.1)) {
                                                this.targetX = targetRunX; this.targetY = targetRunY;
                                                this.isMakingRun = true; this.isMakingFlankRun = true; this.isRequestingDeepBall = true;
                                                specificRunTaken = true; actionDecided = true;
                                            }
                                        }
                                    }
                                    if (!specificRunTaken && Math.random() < WINGER_CUT_INSIDE_CHANCE && ballCarrier) {
                                        const wingerInAttackingThird = (this.team === 'A' && this.x > centerX + FIELD_WIDTH * 0.1) || (this.team === 'B' && this.x < centerX - FIELD_WIDTH * 0.1);
                                        if (wingerInAttackingThird) {
                                            let targetRunX = opponentGoalX + (this.team === 'A' ? -GOAL_WIDTH * 0.6 : GOAL_WIDTH * 0.6);
                                            let targetRunY = centerY + (this.y < centerY ? GOAL_WIDTH * 0.25 : -GOAL_WIDTH * 0.25) * (Math.random()*0.4 + 0.6) ;
                                            if (isSpaceOpen(targetRunX, targetRunY, allPlayers, this.team, this, 1.0)) {
                                                this.targetX = targetRunX; this.targetY = targetRunY;
                                                this.isMakingRun = true; this.isRequestingDeepBall = true;
                                                specificRunTaken = true; actionDecided = true;
                                            }
                                        }
                                    }
                                }
                                if (!actionDecided && !specificRunTaken && this.specificRole === 'ST_Finisher' && ballCarrier && Math.random() < STRIKER_OFFSIDE_RUN_CHANCE && !this.isMakingOffsideRun ) {
                                    const carrierCanPassLong = (this.team === 'A' && ballCarrier.x < centerX + FIELD_WIDTH * 0.15) || (this.team === 'B' && ballCarrier.x > centerX - FIELD_WIDTH * 0.15);
                                    if (carrierCanPassLong) {
                                        let opponents = (this.team === 'A' ? playersTeamB : playersTeamA).filter(p => p.playerType !== 'goalkeeper');
                                        let lastDefenderX = (this.team === 'A') ? Math.min(...opponents.map(p => p.x).filter(x => x > centerX), FIELD_WIDTH - FIELD_MARGIN - PLAYER_RADIUS) : Math.max(...opponents.map(p => p.x).filter(x => x < centerX), FIELD_MARGIN + PLAYER_RADIUS);
                                        if (opponents.length === 0) {
                                            lastDefenderX = (this.team === 'A') ? FIELD_WIDTH - FIELD_MARGIN - PLAYER_RADIUS * 5 : FIELD_MARGIN + PLAYER_RADIUS * 5;
                                        }
                                        let runTargetX = (this.team === 'A') ? lastDefenderX + PLAYER_RADIUS * 3.5 : lastDefenderX - PLAYER_RADIUS * 3.5;
                                        runTargetX = Math.max(FIELD_MARGIN + PLAYER_RADIUS, Math.min(runTargetX, FIELD_WIDTH - FIELD_MARGIN - PLAYER_RADIUS));
                                        let runTargetY = this.y + (Math.random() - 0.5) * GOAL_WIDTH * 0.5;
                                        runTargetY = Math.max(FIELD_MARGIN + PLAYER_RADIUS, Math.min(runTargetY, FIELD_HEIGHT - FIELD_MARGIN - PLAYER_RADIUS));
                                        if (isSpaceOpen(runTargetX, runTargetY, allPlayers, this.team, this, 0.9)) {
                                            this.targetX = runTargetX; this.targetY = runTargetY;
                                            this.isMakingRun = true; this.isMakingOffsideRun = true; this.isRequestingDeepBall = true;
                                            actionDecided = true; specificRunTaken = true;
                                        }
                                    }
                                }
                                // Overlapping run for Wingbacks
                                if (!actionDecided && !specificRunTaken && (this.specificRole === 'LB_Wingback' || this.specificRole === 'RB_Wingback') && ballCarrier && ballCarrier.team === this.team && Math.random() < OVERLAP_RUN_CHANCE) {
                                    const wingerOnMyFlank = allPlayers.find(p => p.team === this.team && ((this.baseY < centerY && p.specificRole === 'LW_Dribbler') || (this.baseY > centerY && p.specificRole === 'RW_Dribbler')));
                                    if (wingerOnMyFlank && wingerOnMyFlank.hasBall) {
                                        const wingerXCondition = (this.team === 'A') ? wingerOnMyFlank.x < WINGER_MIN_X_FOR_OVERLAP : wingerOnMyFlank.x > FIELD_WIDTH - WINGER_MIN_X_FOR_OVERLAP;
                                        const lateralXCondition = (this.team === 'A') ? this.x < LATERAL_MAX_X_FOR_OVERLAP : this.x > FIELD_WIDTH - LATERAL_MAX_X_FOR_OVERLAP;

                                        if (wingerXCondition && lateralXCondition && distance(this.x, this.y, wingerOnMyFlank.x, wingerOnMyFlank.y) > PLAYER_RADIUS * 3) {
                                            let overlapTargetX = opponentGoalX - (this.team === 'A' ? PLAYER_RADIUS * 3 : -PLAYER_RADIUS * 3);
                                            let overlapTargetY = (this.baseY < centerY) ? FIELD_MARGIN + SIDELINE_HUG_BUFFER : FIELD_HEIGHT - FIELD_MARGIN - SIDELINE_HUG_BUFFER;
                                            if (isSpaceOpen(overlapTargetX, overlapTargetY, allPlayers, this.team, this, 1.2)) {
                                                this.targetX = overlapTargetX; this.targetY = overlapTargetY;
                                                this.isMakingRun = true; this.isMakingOverlapRun = true; this.isRequestingDeepBall = true;
                                                actionDecided = true; specificRunTaken = true;
                                            }
                                        }
                                    }
                                }


                                if (!actionDecided && ballCarrier && (this.playerType === 'midfielder' || this.playerType === 'attacker') && this.myTeamTactic !== 'defensivo') {
                                    const distToCarrier = distance(this.x, this.y, ballCarrier.x, ballCarrier.y);
                                    let offerWallPassChance = 0.03;
                                    if (this.specificRole === 'CM_Playmaker' || this.specificRole === 'CM_BoxToBox') offerWallPassChance = 0.1;
                                    if (this.specificRole.includes('Winger') || this.specificRole === 'ST_Finisher') offerWallPassChance = 0.08;
                                    if (this.myTeamTactic === 'ofensivo') offerWallPassChance += 0.05;

                                    const numOffering = allPlayers.filter(p => p.team === this.team && p.isOfferingWallPass).length;

                                    if (numOffering < 1 && distToCarrier < WALL_PASS_OFFER_DISTANCE_MAX && distToCarrier > WALL_PASS_OFFER_DISTANCE_MIN && Math.random() < offerWallPassChance) {
                                        const angleToCarrier = Math.atan2(ballCarrier.y - this.y, ballCarrier.x - this.x);
                                        let wallTargetX = ballCarrier.x + Math.cos(angleToCarrier + Math.PI / 2.5) * PLAYER_RADIUS * 5 + (opponentGoalX - ballCarrier.x) * 0.05;
                                        let wallTargetY = ballCarrier.y + Math.sin(angleToCarrier + Math.PI / 2.5) * PLAYER_RADIUS * 5 + (centerY - ballCarrier.y) * 0.02;

                                        const distFromBaseToWallTarget = distance(wallTargetX, wallTargetY, this.baseX, this.baseY);
                                        const maxDistForWallOffer = FIELD_WIDTH * MAX_ALLOWED_DIST_FROM_BASE_ZONE_X_FACTOR * 1.8;

                                        if (distFromBaseToWallTarget < maxDistForWallOffer) {
                                            if (isSpaceOpen(wallTargetX, wallTargetY, allPlayers, this.team, this, 0.7)) {
                                                this.targetX = wallTargetX; this.targetY = wallTargetY;
                                                this.isOfferingWallPass = true; actionDecided = true;
                                            }
                                        }
                                    }
                                }
                                if (!actionDecided && (this.playerType === 'attacker' || (this.playerType === 'midfielder' && this.myTeamTactic === 'ofensivo') || (this.specificRole.includes('Wingback') && this.myTeamTactic !== 'defensivo'))) {
                                    if (!this.specificRole.includes('Winger') && !this.specificRole.includes('Wingback') && this.specificRole !== 'ST_Finisher') {
                                        const carrierCanPass = ballCarrier && ((this.team === 'A' && ballCarrier.x < opponentGoalX - FIELD_WIDTH * 0.25 && ballCarrier.x > centerX - FIELD_WIDTH * 0.2) || (this.team === 'B' && ballCarrier.x > opponentGoalX + FIELD_WIDTH * 0.25 && ballCarrier.x < centerX + FIELD_WIDTH * 0.2));
                                        let runChance = 0.1;
                                        if (this.myTeamTactic === 'ofensivo') runChance = 0.25;
                                        if (this.playerType === 'attacker') runChance += 0.15;

                                        if (carrierCanPass && Math.random() < runChance) {
                                            let potentialRunX, potentialRunY;
                                            let runDepthFactor = 0.45 + (this.myTeamTactic === 'ofensivo' ? 0.25 : (this.myTeamTactic === 'equilibrado' ? 0.15 : 0)) + (this.playerType === 'attacker' ? 0.15 : (this.playerType === 'midfielder' ? 0.1 : 0));
                                            potentialRunX = this.x + (opponentGoalX - this.x) * runDepthFactor;
                                            if(this.team === 'B') potentialRunX = this.x - (this.x - opponentGoalX) * runDepthFactor;

                                            if (this.playerType==='attacker' && Math.random() < 0.6 ) {
                                                potentialRunX = opponentGoalX + (this.team === 'A' ? -FIELD_WIDTH * 0.1 : FIELD_WIDTH * 0.1) + (Math.random() - 0.5) * GOAL_WIDTH * 0.5;
                                                potentialRunY = centerY + (Math.random() - 0.5) * GOAL_WIDTH * 0.7;
                                                this.isMakingBoxRun = true;
                                            }
                                            else if (Math.random() < 0.5 ) { potentialRunY = centerY + (Math.random() - 0.5) * GOAL_WIDTH * 0.6; }
                                            else { potentialRunY = this.baseY + (effectiveBallY - this.baseY) * 0.2 + (Math.random() - 0.5) * 80; }
                                            potentialRunY = Math.max(FIELD_MARGIN + PLAYER_RADIUS, Math.min(potentialRunY, FIELD_HEIGHT - FIELD_MARGIN - PLAYER_RADIUS));
                                            if (isSpaceOpen(potentialRunX, potentialRunY, allPlayers, this.team, this)) { this.targetX = potentialRunX; this.targetY = potentialRunY; this.isMakingRun = true; actionDecided = true; }
                                        }
                                    }
                                }
                                if (!actionDecided && (this.playerType === 'attacker' || this.playerType === 'midfielder')) {
                                     if (!this.specificRole.includes('Winger') && !this.specificRole.includes('Wingback') && this.specificRole !== 'ST_Finisher') {
                                        const hotzoneXMin = (this.team === 'A') ? ATTACKING_HOTZONE.xMinTeamA : ATTACKING_HOTZONE.xMinTeamB; const hotzoneXMax = (this.team === 'A') ? ATTACKING_HOTZONE.xMaxTeamA : ATTACKING_HOTZONE.xMaxTeamB; const hotzoneWidth = (this.team === 'A') ? ATTACKING_HOTZONE.widthTeamA : ATTACKING_HOTZONE.widthTeamB; const hotzoneIsInFront = (this.team === 'A' && hotzoneXMin > this.x - 30) || (this.team === 'B' && hotzoneXMax < this.x + 30); let hotzoneInfluenceFactor = 0.1 + (this.myTeamTactic === 'ofensivo' ? 0.1 : 0); if (this.playerType === 'attacker') hotzoneInfluenceFactor += 0.1; if (hotzoneIsInFront && Math.random() < hotzoneInfluenceFactor) { let tryX = hotzoneXMin + Math.random() * hotzoneWidth; let tryY = ATTACKING_HOTZONE.yMin + Math.random() * ATTACKING_HOTZONE.height; if (isSpaceOpen(tryX, tryY, allPlayers, this.team, this) && distance(tryX, tryY, effectiveBallX, effectiveBallY) < FIELD_WIDTH / 2.8) { this.targetX = tryX; this.targetY = tryY; this.isMakingRun = false; actionDecided = true; } }
                                    }
                                }
                            }

                            if (!actionDecided) {
                                let extendedLooseBallRange = TARGET_LOOSE_BALL_RANGE * 1.5;
                                if (!ball.heldBy && distToEffectiveBall < extendedLooseBallRange && !ball.isKicked && (!ball.isAirborne || ball.airborneTimer < 5) ) {
                                     this.targetX = effectiveBallX;
                                     this.targetY = effectiveBallY;
                                } else if (isOutOfZone &&
                                    (
                                        (!ball.heldBy && distToEffectiveBall > extendedLooseBallRange * 1.2) ||
                                        (ball.heldBy && ball.heldBy.team !== this.team) ||
                                        this.myTeamTactic === 'defensivo' ||
                                        (this.playerType === 'defender' && !this.specificRole.includes('Wingback'))
                                    )
                                ) {
                                    this.targetX = idealZoneCenterX + (Math.random() - 0.5) * PLAYER_RADIUS * 2;
                                    this.targetY = idealZoneCenterY + (Math.random() - 0.5) * PLAYER_RADIUS * 2;
                                } else {
                                    let aggressionFactor = 0.25 + this.decisionVariation;
                                    if (this.myTeamTactic === 'ofensivo') aggressionFactor += 0.20;
                                    else if (this.myTeamTactic === 'defensivo') aggressionFactor -= 0.15;
                                    if(this.specificRole === 'CM_Playmaker') aggressionFactor = Math.max(0.01, aggressionFactor - 0.25);
                                    if(this.playerType === 'defender' && !this.specificRole.includes('Wingback')) aggressionFactor *= 0.4;
                                    aggressionFactor = Math.max(0.01, Math.min(aggressionFactor, 0.8));

                                    let tempTargetX = idealZoneCenterX + (effectiveBallX - idealZoneCenterX) * aggressionFactor;
                                    let tempTargetY = idealZoneCenterY + (effectiveBallY - idealZoneCenterY) * aggressionFactor;

                                    tempTargetX += (Math.random() - 0.5) * PLAYER_RADIUS * 3;
                                    tempTargetY += (Math.random() - 0.5) * PLAYER_RADIUS * 3;

                                    let bestShiftX = tempTargetX; let bestShiftY = tempTargetY;
                                    let minViolations = Infinity;
                                    let attempts = 0;
                                    while(attempts < 3){
                                        let violations = 0;
                                        let currentShiftX = tempTargetX; let currentShiftY = tempTargetY;
                                        if (attempts > 0) { currentShiftX += (Math.random() - 0.5) * PLAYER_RADIUS * (3 + attempts*2); currentShiftY += (Math.random() - 0.5) * PLAYER_RADIUS * (3 + attempts*2); }

                                        currentShiftX = Math.max(FIELD_MARGIN + this.radius, Math.min(currentShiftX, FIELD_WIDTH - FIELD_MARGIN - this.radius));
                                        currentShiftY = Math.max(FIELD_MARGIN + this.radius, Math.min(currentShiftY, FIELD_HEIGHT - FIELD_MARGIN - this.radius));

                                        for (const p of allPlayers) { if (p.team === this.team && p !== this && !p.hasBall) { if (distance(currentShiftX, currentShiftY, p.x, p.y) < MIN_DIST_TO_TEAMMATE_FOR_SPACE) { violations++; } } }
                                        if (violations === 0) { bestShiftX = currentShiftX; bestShiftY = currentShiftY; break;  }
                                        if (violations < minViolations) { minViolations = violations; bestShiftX = currentShiftX; bestShiftY = currentShiftY; }
                                        attempts++;
                                    }
                                    this.targetX = bestShiftX; this.targetY = bestShiftY;
                                }
                            }
                        }
                    }
                    this.targetX = Math.max(FIELD_MARGIN + this.radius, Math.min(this.targetX, FIELD_WIDTH - FIELD_MARGIN - this.radius));
                    this.targetY = Math.max(FIELD_MARGIN + this.radius, Math.min(this.targetY, FIELD_HEIGHT - FIELD_MARGIN - this.radius));
                }
            }
            kick(ball, targetX, targetY, strength, isHighPass = false) {
                if (!this.hasBall) return;
                this.stats.passesAttempted++;
                let kickAngle = Math.atan2(targetY - this.y, targetX - this.x);
                let finalStrength = strength;

                kickAngle += (Math.random() - 0.5) * BASE_KICK_ERROR_ANGLE;

                if (strength === SHOT_STRENGTH || strength === FREE_KICK_SHOT_STRENGTH) this.stats.shots++;

                if (this.staminaCurrent / this.staminaMax < FATIGUE_EFFECT_ON_ACCURACY_THRESHOLD) {
                    const errorMagnitude = (1.0 - (this.staminaCurrent / (this.staminaMax * FATIGUE_EFFECT_ON_ACCURACY_THRESHOLD))) * MAX_KICK_ANGLE_ERROR_FATIGUE;
                    kickAngle += errorMagnitude * (Math.random() - 0.5) * 2;
                    finalStrength *= (MIN_KICK_STRENGTH_FATIGUE_FACTOR + (1.0 - MIN_KICK_STRENGTH_FATIGUE_FACTOR) * (this.staminaCurrent / this.staminaMax) );
                }
                finalStrength = Math.max(finalStrength, BALL_RADIUS);


                ball.vx = Math.cos(kickAngle) * finalStrength;
                ball.vy = Math.sin(kickAngle) * finalStrength;
                ball.isKicked = true; ball.heldBy = null; this.hasBall = false; ball.lastTouchedBy = this;
                this.framesHoldingBall = 0;

                if (isHighPass) {
                    ball.isAirborne = true;
                    const distToTarget = distance(this.x, this.y, targetX, targetY);
                    let duration = Math.max(MIN_AIRBORNE_FRAMES, Math.min(MAX_AIRBORNE_FRAMES, (distToTarget / (finalStrength * 0.5)) * HIGH_PASS_AIRBORNE_DURATION_FACTOR));
                    ball.airborneTimer = duration;
                    ball.initialAirborneDuration = duration;
                    ball.shadowSizeFactor = 0.3;
                } else {
                    ball.isAirborne = false;
                    ball.airborneTimer = 0;
                    ball.shadowSizeFactor = 1;
                }

                const isPassingKick = strength <= PASS_STRENGTH_LONG * 1.1 &&
                                      strength !== GOALKEEPER_CLEARANCE_STRENGTH &&
                                      strength !== SHOT_STRENGTH && strength !== FREE_KICK_SHOT_STRENGTH &&
                                      (gameState === 'playing' || gameState.startsWith('preparing') || gameState === 'kickOff');

                if (isPassingKick) {
                    ball.passData = {
                        passerId: this.id,
                        passerTeam: this.team,
                        ballPositionX: this.x,
                        teamAPositionsAtPass: playersTeamA.map(p => ({ id: p.id, x: p.x, y: p.y })),
                        teamBPositionsAtPass: playersTeamB.map(p => ({ id: p.id, x: p.x, y: p.y })),
                        isFromSetPiece: gameState.startsWith('preparing') || gameState === 'kickOff'
                    };
                } else {
                    ball.passData = null;
                }
                setTimeout(() => { ball.isKicked = false; }, 150);
            }
            resetToFormation() { this.x = this.baseX; this.y = this.baseY; this.targetX = this.baseX; this.targetY = this.baseY; this.vx = 0; this.vy = 0; this.hasBall = false; this.isMakingRun = false; this.isPrimaryPresser = false; this.lastTackleAttemptTime = 0; this.justWonBallTime = 0; this.isOfferingWallPass = false; this.isOfferingForThrowIn = false; this.isOfferingForFreeKickSupport = false; this.isMakingFlankRun = false; this.isMakingBoxRun = false; this.isMakingOffsideRun = false; this.isRequestingDeepBall = false; this.framesHoldingBall = 0; this.isPerformingEscapeDribble = false; this.escapeDribbleTimer = 0; this.isMakingOverlapRun = false; this.isMakingRunForCross = false; this.stats = { goals: 0, assists: 0, shots: 0, passesAttempted: 0, passesCompleted: 0, recoveries: 0 }; this.staminaCurrent = this.staminaMax; this.fatigueFactor = 1.0;}
        }
        class Ball {
            constructor(x, y) {
                this.x = x; this.y = y; this.radius = BALL_RADIUS; this.color = '#FFFFFF';
                this.vx = 0; this.vy = 0; this.heldBy = null; this.isKicked = false;
                this.lastTouchedBy = null; this.passData = null;
                this.isAirborne = false;
                this.airborneTimer = 0;
                this.initialAirborneDuration = 0;
                this.shadowSizeFactor = 1;
            }
            draw() {
                ctx.fillStyle = SHADOW_COLOR;
                ctx.beginPath();
                let shadowRadius = this.radius * this.shadowSizeFactor;
                let shadowOffsetX = 0;
                let shadowOffsetY = this.isAirborne ? (this.radius - shadowRadius) * 1.5 + 2 : 2;
                ctx.arc(this.x + shadowOffsetX, this.y + shadowOffsetY, shadowRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                let displayRadius = this.isAirborne ? this.radius * AIRBORNE_BALL_RADIUS_SCALE : this.radius;
                ctx.arc(this.x, this.y, displayRadius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.closePath();
            }
            update() {
                if (this.isAirborne) {
                    this.airborneTimer--;
                    if (this.initialAirborneDuration > 0) {
                        this.shadowSizeFactor = Math.max(0.2, 1 - (this.airborneTimer / this.initialAirborneDuration) * 0.7);
                    }
                    if (this.airborneTimer <= 0) {
                        this.isAirborne = false;
                        this.airborneTimer = 0;
                        this.shadowSizeFactor = 1;
                    }
                }

                if (!this.heldBy) { this.x += this.vx; this.y += this.vy; this.vx *= BALL_FRICTION; this.vy *= BALL_FRICTION; if (Math.abs(this.vx) < BALL_STOP_THRESHOLD) this.vx = 0; if (Math.abs(this.vy) < BALL_STOP_THRESHOLD) this.vy = 0; }
                let outOfBounds = false; let restartType = null; let byTeam = this.lastTouchedBy ? this.lastTouchedBy.team : null; let restartSide = null; let ballRestartX = this.x; let ballRestartY = this.y;
                if (this.y - this.radius < FIELD_MARGIN) { outOfBounds = true; restartType = 'throwIn'; restartSide = 'top'; ballRestartY = FIELD_MARGIN + this.radius; }
                else if (this.y + this.radius > FIELD_HEIGHT - FIELD_MARGIN) { outOfBounds = true; restartType = 'throwIn'; restartSide = 'bottom'; ballRestartY = FIELD_HEIGHT - FIELD_MARGIN - this.radius; }
                if (this.x - this.radius < FIELD_MARGIN) {
                    if (!(this.y > centerY - GOAL_WIDTH/2 && this.y < centerY + GOAL_WIDTH/2)) {
                        outOfBounds = true; restartSide = 'left'; ballRestartX = FIELD_MARGIN + this.radius;
                        if (this.lastTouchedBy) {
                            restartType = (this.lastTouchedBy.team === 'B') ? 'goalKick' : 'cornerKick';
                        } else { restartType = 'goalKick'; byTeam = 'A'; }
                    }
                }
                else if (this.x + this.radius > FIELD_WIDTH - FIELD_MARGIN) {
                    if (!(this.y > centerY - GOAL_WIDTH/2 && this.y < centerY + GOAL_WIDTH/2)) {
                        outOfBounds = true; restartSide = 'right'; ballRestartX = FIELD_WIDTH - FIELD_MARGIN - this.radius;
                        if (this.lastTouchedBy) {
                            restartType = (this.lastTouchedBy.team === 'A') ? 'goalKick' : 'cornerKick';
                        } else { restartType = 'goalKick'; byTeam = 'B';}
                    }
                }
                if (outOfBounds && gameState === 'playing') { this.x = ballRestartX; this.y = ballRestartY; this.vx = 0; this.vy = 0; if (this.heldBy) {this.heldBy.hasBall = false; this.heldBy = null;} this.isAirborne = false; this.airborneTimer = 0; this.shadowSizeFactor = 1; handleBallOutOfBounds(restartType, restartSide, this.lastTouchedBy ? this.lastTouchedBy.team : null); }

                const goalTopY = centerY - GOAL_WIDTH / 2; const goalBottomY = centerY + GOAL_WIDTH / 2;
                if (this.x - this.radius < FIELD_MARGIN && this.x + this.radius > FIELD_MARGIN - GOAL_DEPTH - 5 && this.y > goalTopY && this.y < goalBottomY && gameState === 'playing') { handleGoal('B'); }
                if (this.x + this.radius > FIELD_WIDTH - FIELD_MARGIN && this.x - this.radius < FIELD_WIDTH - FIELD_MARGIN + GOAL_DEPTH + 5 && this.y > goalTopY && this.y < goalBottomY && gameState === 'playing') { handleGoal('A'); }

                const posts = [ {x: FIELD_MARGIN, y: goalTopY}, {x: FIELD_MARGIN, y: goalBottomY}, {x: FIELD_WIDTH - FIELD_MARGIN, y: goalTopY}, {x: FIELD_WIDTH - FIELD_MARGIN, y: goalBottomY} ];
                posts.forEach(post => { if(distance(this.x, this.y, post.x, post.y) < this.radius + POST_RADIUS) { const angle = Math.atan2(this.y - post.y, this.x - post.x); const speed = Math.sqrt(this.vx**2 + this.vy**2); this.vx = Math.cos(angle) * speed * 0.8; this.vy = Math.sin(angle) * speed * 0.8; this.x = post.x + (this.radius + POST_RADIUS + 1) * Math.cos(angle); this.y = post.y + (this.radius + POST_RADIUS + 1) * Math.sin(angle); if(this.heldBy) { this.heldBy.hasBall = false; this.heldBy = null; } this.isAirborne = false; this.airborneTimer = 0; this.shadowSizeFactor = 1;} });
            }
        }
        function drawField() { ctx.fillStyle = FIELD_COLOR; ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT); ctx.strokeStyle = LINE_COLOR; ctx.lineWidth = 2; ctx.strokeRect(FIELD_MARGIN, FIELD_MARGIN, FIELD_WIDTH - 2 * FIELD_MARGIN, FIELD_HEIGHT - 2 * FIELD_MARGIN); ctx.beginPath(); ctx.moveTo(centerX, FIELD_MARGIN); ctx.lineTo(centerX, FIELD_HEIGHT - FIELD_MARGIN); ctx.stroke(); ctx.beginPath(); ctx.arc(centerX, centerY, 60, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(centerX, centerY, 5, 0, Math.PI * 2); ctx.fillStyle = LINE_COLOR; ctx.fill(); ctx.closePath(); ctx.strokeStyle = '#DDDDDD'; ctx.lineWidth = 4;  ctx.beginPath(); ctx.moveTo(FIELD_MARGIN, centerY - GOAL_WIDTH / 2); ctx.lineTo(FIELD_MARGIN - GOAL_DEPTH, centerY - GOAL_WIDTH / 2); ctx.lineTo(FIELD_MARGIN - GOAL_DEPTH, centerY + GOAL_WIDTH / 2); ctx.lineTo(FIELD_MARGIN, centerY + GOAL_WIDTH / 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(FIELD_WIDTH - FIELD_MARGIN, centerY - GOAL_WIDTH / 2); ctx.lineTo(FIELD_WIDTH - FIELD_MARGIN + GOAL_DEPTH, centerY - GOAL_WIDTH / 2); ctx.lineTo(FIELD_WIDTH - FIELD_MARGIN + GOAL_DEPTH, centerY + GOAL_WIDTH / 2); ctx.lineTo(FIELD_WIDTH - FIELD_MARGIN, centerY + GOAL_WIDTH / 2); ctx.stroke(); ctx.strokeStyle = LINE_COLOR; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(FIELD_MARGIN, centerY - GOAL_WIDTH / 2); ctx.lineTo(FIELD_MARGIN, centerY + GOAL_WIDTH / 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(FIELD_WIDTH - FIELD_MARGIN, centerY - GOAL_WIDTH / 2); ctx.lineTo(FIELD_WIDTH - FIELD_MARGIN, centerY + GOAL_WIDTH / 2); ctx.stroke(); ctx.strokeStyle = LINE_COLOR; ctx.lineWidth = 2; const penaltyAreaWidth = 165; const penaltyAreaHeight = FIELD_HEIGHT * 0.58;  ctx.strokeRect(FIELD_MARGIN, centerY - penaltyAreaHeight / 2, penaltyAreaWidth, penaltyAreaHeight); ctx.strokeRect(FIELD_WIDTH - FIELD_MARGIN - penaltyAreaWidth, centerY - penaltyAreaHeight / 2, penaltyAreaWidth, penaltyAreaHeight); }

        function isPlayerOffsideAtMomentOfPass(playerPosAtPass, playerTeam, opponentPositionsAtPass, ballXAtPass) {
            const ownHalfLine = centerX;
            let inOpponentHalf = false;
            if (playerTeam === 'A') { if (playerPosAtPass.x > ownHalfLine) inOpponentHalf = true; }
            else { if (playerPosAtPass.x < ownHalfLine) inOpponentHalf = true; }
            if (!inOpponentHalf) return false;

            let aheadOfBall = false;
            if (playerTeam === 'A') { if (playerPosAtPass.x > ballXAtPass + BALL_RADIUS) aheadOfBall = true; }
            else { if (playerPosAtPass.x < ballXAtPass - BALL_RADIUS) aheadOfBall = true; }

            if (opponentPositionsAtPass.length < 2) return false;

            let sortedOpponentsX = opponentPositionsAtPass.map(p => p.x);
            if (playerTeam === 'A') { sortedOpponentsX.sort((a, b) => b - a);  }
            else { sortedOpponentsX.sort((a, b) => a - b); }

            const secondLastOpponentX = sortedOpponentsX[1];

            let aheadOfSecondLastOpponent = false;
            if (playerTeam === 'A') { if (playerPosAtPass.x > secondLastOpponentX + PLAYER_RADIUS) aheadOfSecondLastOpponent = true; }
            else { if (playerPosAtPass.x < secondLastOpponentX - PLAYER_RADIUS) aheadOfSecondLastOpponent = true; }

            if (aheadOfSecondLastOpponent) {
                return aheadOfBall;
            }
            return false;
        }
        function handleOffside(offendingPlayer, playerPosAtPassMoment, allPlayers) {
            if (gameState !== 'playing') return;
            gameState = 'preparingFreeKick';
            const byTeam = offendingPlayer.team;
            const restartTeam = (byTeam === 'A') ? 'B' : 'A';

            ball.x = playerPosAtPassMoment.x;
            ball.y = playerPosAtPassMoment.y;
            if (ball.heldBy) ball.heldBy.hasBall = false;
            ball.heldBy = null; ball.vx = 0; ball.vy = 0;

            let closestPlayer = null; let minDist = Infinity;
            (restartTeam === 'A' ? playersTeamA : playersTeamB).forEach(p => {
                const d = distance(p.x, p.y, ball.x, ball.y);
                if (d < minDist) { minDist = d; closestPlayer = p; }
            });
            if (!closestPlayer) {
                const teamArray = (restartTeam === 'A' ? playersTeamA : playersTeamB);
                closestPlayer = teamArray[Math.floor(teamArray.length / 2)];
            }
            if (closestPlayer) {
                ball.heldBy = closestPlayer; closestPlayer.hasBall = true;
                closestPlayer.x = ball.x - (closestPlayer.team === 'A' ? PLAYER_RADIUS + BALL_RADIUS +1 : -(PLAYER_RADIUS + BALL_RADIUS+1));
                closestPlayer.y = ball.y;
            }

            allPlayers.forEach(p => {
                if (p.team === byTeam) {
                    if (distance(p.x, p.y, ball.x, ball.y) < PLAYER_RADIUS * 10) {
                        const angleAway = Math.atan2(p.y - ball.y, p.x - ball.x);
                        p.targetX = ball.x + Math.cos(angleAway) * PLAYER_RADIUS * 10.5;
                        p.targetY = ball.y + Math.sin(angleAway) * PLAYER_RADIUS * 10.5;
                    }
                }
            });

            restartTimer = RESTART_DELAY_FRAMES;
            const msg = `Fuera de Juego: Equipo ${restartTeam === 'A' ? teamAName : teamBName}`;
            document.getElementById('gameStateDisplay').textContent = msg;
            document.getElementById('restartMessage').textContent = msg;
            document.getElementById('restartMessage').style.display = 'block';
        }
        function handleFoul(fouler, fouledPlayer, foulX, foulY, allPlayers) {
            if (gameState !== 'playing') return;
            gameState = 'preparingFreeKickFoul';
            const byTeam = fouler.team;
            const restartTeam = fouledPlayer.team;

            ball.x = foulX; ball.y = foulY;
            if (ball.heldBy) ball.heldBy.hasBall = false;
            ball.heldBy = null; ball.vx = 0; ball.vy = 0;

            let kicker = null;
            let potentialKickers = (restartTeam === 'A' ? playersTeamA : playersTeamB)
                .filter(p => p !== fouledPlayer && p.playerType !== 'goalkeeper')
                .sort((a,b) => distance(a.x, a.y, ball.x, ball.y) - distance(b.x, b.y, ball.x, ball.y));

            if (potentialKickers.length > 0) kicker = potentialKickers[0];
            else kicker = fouledPlayer;

            if (kicker) {
                ball.heldBy = kicker; kicker.hasBall = true;
                kicker.x = ball.x - (kicker.team === 'A' ? PLAYER_RADIUS * 1.5 : -PLAYER_RADIUS * 1.5);
                kicker.y = ball.y;
            }

            allPlayers.forEach(p => {
                if (p.team === byTeam) {
                    if (distance(p.x, p.y, ball.x, ball.y) < FREEKICK_WALL_DISTANCE + PLAYER_RADIUS) {
                        const angleAway = Math.atan2(p.y - ball.y, p.x - ball.x);
                        p.targetX = ball.x + Math.cos(angleAway) * (FREEKICK_WALL_DISTANCE + PLAYER_RADIUS * 1.5);
                        p.targetY = ball.y + Math.sin(angleAway) * (FREEKICK_WALL_DISTANCE + PLAYER_RADIUS * 1.5);
                    }
                }
            });

            restartTimer = RESTART_DELAY_FRAMES;
            const msg = `Falta: Tiro Libre Equipo ${restartTeam === 'A' ? teamAName : teamBName}`;
            document.getElementById('gameStateDisplay').textContent = msg;
            document.getElementById('restartMessage').textContent = msg;
            document.getElementById('restartMessage').style.display = 'block';
        }
        function handleBallOutOfBounds(type, side, lastTouchTeam) {
            gameState = `preparing${type.charAt(0).toUpperCase() + type.slice(1).replace('-', '')}`;
            restartTimer = RESTART_DELAY_FRAMES;
            let restartTeam = null;
            let restartMessageText = "";

            const allGamePlayers = [...playersTeamA, ...playersTeamB];
            allGamePlayers.forEach(p => p.isOfferingForThrowIn = false);

            if (type === 'throwIn') {
                restartTeam = (lastTouchTeam === 'A') ? 'B' : 'A';
                restartMessageText = `Saque de Banda: Equipo ${restartTeam === 'A' ? teamAName : teamBName}`;

                const teamToSelectFrom = (restartTeam === 'A' ? playersTeamA : playersTeamB);
                let throwInTakerPlayer = null;
                let minDistToBall = Infinity;

                teamToSelectFrom.forEach(p => {
                    if (p.playerType !== 'goalkeeper') {
                        const d = distance(p.x, p.y, ball.x, ball.y);
                        if (d < minDistToBall) {
                            minDistToBall = d;
                            throwInTakerPlayer = p;
                        }
                    }
                });

                if (!throwInTakerPlayer && teamToSelectFrom.length > 0) {
                    throwInTakerPlayer = teamToSelectFrom.find(p => p.playerType !== 'goalkeeper') || teamToSelectFrom[0];
                }

                if (throwInTakerPlayer) {
                    ball.heldBy = throwInTakerPlayer;
                    throwInTakerPlayer.hasBall = true;

                    if (side === 'top') {
                        throwInTakerPlayer.x = ball.x;
                        throwInTakerPlayer.y = FIELD_MARGIN - throwInTakerPlayer.radius - 2;
                    } else if (side === 'bottom') {
                        throwInTakerPlayer.x = ball.x;
                        throwInTakerPlayer.y = FIELD_HEIGHT - FIELD_MARGIN + throwInTakerPlayer.radius + 2;
                    } else if (side === 'left') {
                        throwInTakerPlayer.y = ball.y;
                        throwInTakerPlayer.x = FIELD_MARGIN - throwInTakerPlayer.radius - 2;
                    } else if (side === 'right') {
                        throwInTakerPlayer.y = ball.y;
                        throwInTakerPlayer.x = FIELD_WIDTH - FIELD_MARGIN + throwInTakerPlayer.radius + 2;
                    }
                }

                let potentialOfferers = teamToSelectFrom.filter(p => p !== throwInTakerPlayer && p.playerType !== 'goalkeeper')
                    .map(p => ({ player: p, dist: distance(p.x, p.y, ball.x, ball.y) }))
                    .sort((a, b) => a.dist - b.dist);

                let offerersCount = 0;
                for (let i = 0; i < potentialOfferers.length && offerersCount < 2; i++) {
                    potentialOfferers[i].player.isOfferingForThrowIn = true;
                    offerersCount++;
                }

            } else if (type === 'goalKick') {
                restartTeam = (side === 'left') ? 'A' : 'B';
                restartMessageText = `Saque de Meta: Equipo ${restartTeam === 'A' ? teamAName : teamBName}`;
                ball.x = (restartTeam === 'A') ? FIELD_MARGIN + PLAYER_RADIUS * 3 : FIELD_WIDTH - FIELD_MARGIN - PLAYER_RADIUS * 3;
                ball.y = centerY;
                const keeper = (restartTeam === 'A' ? playersTeamA : playersTeamB).find(p => p.playerType === 'goalkeeper');
                if(keeper) {
                    ball.heldBy = keeper;
                    keeper.hasBall = true;
                    keeper.x = ball.x + (keeper.team === 'A' ? -(BALL_RADIUS + PLAYER_RADIUS + 1) : (BALL_RADIUS + PLAYER_RADIUS + 1));
                    keeper.y = ball.y;
                }
            } else if (type === 'cornerKick') {
                restartTeam = (lastTouchTeam === 'A') ? 'B' : 'A';
                restartMessageText = `Saque de Esquina: Equipo ${restartTeam === 'A' ? teamAName : teamBName}`;

                if (side === 'left') ball.x = FIELD_MARGIN + BALL_RADIUS + 1;
                else ball.x = FIELD_WIDTH - FIELD_MARGIN - BALL_RADIUS - 1;
                ball.y = (ball.y < centerY) ? FIELD_MARGIN + BALL_RADIUS + 1 : FIELD_HEIGHT - FIELD_MARGIN - BALL_RADIUS - 1;

                let closestPlayer = null; let minDist = Infinity;
                 (restartTeam === 'A' ? playersTeamA : playersTeamB).forEach(p => {
                    if(p.playerType !== 'goalkeeper'){
                        const d = distance(p.x, p.y, ball.x, ball.y);
                        if (d < minDist) { minDist = d; closestPlayer = p; }
                    }
                });
                if(closestPlayer) {
                    ball.heldBy = closestPlayer;
                    closestPlayer.hasBall = true;
                    closestPlayer.x = ball.x;
                    closestPlayer.y = ball.y;
                }
            }
            document.getElementById('gameStateDisplay').textContent = restartMessageText;
            document.getElementById('restartMessage').textContent = restartMessageText;
            document.getElementById('restartMessage').style.display = 'block';
        }

        function updateTeamPlayWidthDynamic() {
            if (gameState !== 'playing' || gameTimeElapsedFrames < FRAMES_PER_SECOND * 5) return;

            if (teamA_tactic === 'ofensivo') {
                teamA_playWidth = 'wide';
                if (scoreTeamA < scoreTeamB && gameTimeElapsedFrames > TOTAL_MATCH_TIME_SECONDS * FRAMES_PER_SECOND * 0.6) {
                    teamA_playWidth = 'wide';
                }
            } else if (teamA_tactic === 'defensivo') {
                teamA_playWidth = 'narrow';
                if (scoreTeamA > scoreTeamB && gameTimeElapsedFrames > TOTAL_MATCH_TIME_SECONDS * FRAMES_PER_SECOND * 0.6) {
                    teamA_playWidth = 'narrow';
                }
            } else {
                teamA_playWidth = 'normal';
                 if (scoreTeamA < scoreTeamB -1) teamA_playWidth = 'wide';
                 else if (scoreTeamA > scoreTeamB + 1) teamA_playWidth = 'narrow';
            }

            if (teamB_tactic === 'ofensivo') {
                teamB_playWidth = 'wide';
            } else if (teamB_tactic === 'defensivo') {
                teamB_playWidth = 'narrow';
            } else {
                teamB_playWidth = 'normal';
            }

            document.getElementById('playWidthTeamA').textContent = teamA_playWidth.charAt(0).toUpperCase() + teamA_playWidth.slice(1);
            document.getElementById('playWidthTeamB').textContent = teamB_playWidth.charAt(0).toUpperCase() + teamB_playWidth.slice(1);
        }


        function updateTeamTacticsDynamic() { if (gameState !== 'playing' || gameTimeElapsedFrames < FRAMES_PER_SECOND * 10) return; const gameTimeElapsedSeconds = Math.floor(gameTimeElapsedFrames / FRAMES_PER_SECOND); const matchPhaseRatio = gameTimeElapsedSeconds / TOTAL_MATCH_TIME_SECONDS; let newTacticA = teamA_tactic; let newTacticB = teamB_tactic; const diffA = scoreTeamA - scoreTeamB; if (matchPhaseRatio > 0.75) { if (diffA < 0) newTacticA = 'ofensivo'; else if (diffA === 1) newTacticA = 'defensivo'; else if (diffA === 0) newTacticA = 'equilibrado'; } else if (matchPhaseRatio > 0.40) { if (diffA <= -2) newTacticA = 'ofensivo'; else if (diffA === -1 && teamA_tactic !== 'ofensivo') newTacticA = 'equilibrado'; else if (diffA >= 2 && teamA_tactic === 'ofensivo') newTacticA = 'equilibrado'; } else { if (diffA >=2 && teamA_tactic === 'ofensivo') newTacticA = 'equilibrado'; if (diffA <=-2 && teamA_tactic === 'defensivo') newTacticA = 'equilibrado';} const diffB = scoreTeamB - scoreTeamA; if (matchPhaseRatio > 0.75) { if (diffB < 0) newTacticB = 'ofensivo'; else if (diffB === 1) newTacticB = 'defensivo'; else if (diffB === 0) newTacticB = 'equilibrado'; } else if (matchPhaseRatio > 0.40) { if (diffB <= -2) newTacticB = 'ofensivo'; else if (diffB === -1 && teamB_tactic !== 'ofensivo') newTacticB = 'equilibrado'; else if (diffB >= 2 && teamB_tactic === 'ofensivo') newTacticB = 'equilibrado'; } else { if (diffB >=2 && teamB_tactic === 'ofensivo') newTacticB = 'equilibrado'; if (diffB <=-2 && teamB_tactic === 'defensivo') newTacticB = 'equilibrado';} if (teamA_tactic !== newTacticA) { console.log(`Team A tactic change: ${teamA_tactic} -> ${newTacticA} at minute ${Math.floor((gameTimeElapsedSeconds / TOTAL_MATCH_TIME_SECONDS) * 90)}`); teamA_tactic = newTacticA; document.getElementById('tacticTeamA').textContent = teamA_tactic.charAt(0).toUpperCase() + teamA_tactic.slice(1); } if (teamB_tactic !== newTacticB) { console.log(`Team B tactic change: ${teamB_tactic} -> ${newTacticB} at minute ${Math.floor((gameTimeElapsedSeconds / TOTAL_MATCH_TIME_SECONDS) * 90)}`); teamB_tactic = newTacticB; document.getElementById('tacticTeamB').textContent = teamB_tactic.charAt(0).toUpperCase() + teamB_tactic.slice(1); } }

        function initGame(teamAKeyPassed, teamBKeyPassed) {
            const teamAKey = teamAKeyPassed || "MadridCity";
            const teamBKey = teamBKeyPassed || "BarcelonaCity";

            const teamAData = SIM_TEAMS_DATA[teamAKey] || SIM_TEAMS_DATA.RojoGenerico; // Use SIM_TEAMS_DATA
            const teamBData = SIM_TEAMS_DATA[teamBKey] || SIM_TEAMS_DATA.AzulGenerico; // Use SIM_TEAMS_DATA

            playersTeamA = [];
            playersTeamB = [];

            teamAName = teamAData.name;
            teamBName = teamBData.name;

            teamA_tactic = urlParams.get('tacticA') || teamAData.initialTactic;
            teamB_tactic = urlParams.get('tacticB') || teamBData.initialTactic;
            teamA_playWidth = urlParams.get('playWidthA') || teamAData.initialPlayWidth;
            teamB_playWidth = urlParams.get('playWidthB') || teamBData.initialPlayWidth;


            teamAData.formation.forEach(pos => {
                playersTeamA.push(new Player(pos.x, pos.y, 'A', pos.type, pos.specificRole, teamAData.color));
            });
            teamBData.formation.forEach(pos => {
                playersTeamB.push(new Player(FIELD_WIDTH - pos.x, pos.y, 'B', pos.type, pos.specificRole, teamBData.color));
            });

            ball = new Ball(centerX, centerY);
            gameState = 'kickOff';
            gameTimeElapsedFrames = 0;
            restartTimer = RESTART_DELAY_FRAMES / 2;

            const kickOffTakerTeam = Math.random() < 0.5 ? playersTeamA : playersTeamB;
            let kicker = kickOffTakerTeam.find(p => p.specificRole === 'ST_Finisher') ||
                         kickOffTakerTeam.find(p => p.specificRole === 'CM_Playmaker') ||
                         kickOffTakerTeam.find(p => p.playerType === 'attacker' && Math.abs(p.baseY - centerY) < 50) ||
                         kickOffTakerTeam.find(p => p.playerType === 'midfielder' && Math.abs(p.baseY - centerY) < 50) ||
                         kickOffTakerTeam[Math.floor(kickOffTakerTeam.length / 2)];

            if (kicker) {
                ball.heldBy = kicker;
                kicker.hasBall = true;
                ball.x = kicker.x + (kicker.team === 'A' ? ball.radius + kicker.radius + 1 : -(ball.radius + kicker.radius + 1));
                ball.y = kicker.y;
            } else if (kickOffTakerTeam.length > 0) {
                kicker = kickOffTakerTeam[0];
                ball.heldBy = kicker;
                kicker.hasBall = true;
                ball.x = kicker.x + (kicker.team === 'A' ? ball.radius + kicker.radius + 1 : -(ball.radius + kicker.radius + 1));
                ball.y = kicker.y;
            }


            scoreTeamA = 0; scoreTeamB = 0;
            document.getElementById('teamAName').textContent = teamAName;
            document.getElementById('scoreTeamA').textContent = scoreTeamA;
            document.getElementById('teamBName').textContent = teamBName;
            document.getElementById('scoreTeamB').textContent = scoreTeamB;

            document.getElementById('tacticTeamA').textContent = teamA_tactic.charAt(0).toUpperCase() + teamA_tactic.slice(1);
            document.getElementById('tacticTeamB').textContent = teamB_tactic.charAt(0).toUpperCase() + teamB_tactic.slice(1);
            document.getElementById('playWidthTeamA').textContent = teamA_playWidth.charAt(0).toUpperCase() + teamA_playWidth.slice(1);
            document.getElementById('playWidthTeamB').textContent = teamB_playWidth.charAt(0).toUpperCase() + teamB_playWidth.slice(1);

            document.getElementById('gameStateDisplay').textContent = "Saque Inicial";
            document.getElementById('gameTimeDisplay').textContent = "00:00";
            document.getElementById('goalMessage').style.display = 'none';
            document.getElementById('restartMessage').style.display = 'none';
            document.getElementById('statsDisplay').style.display = 'none';
        }
        function resetPositionsAfterGoal(scoringTeam) {
            gameState = 'kickOff'; restartTimer = RESTART_DELAY_FRAMES;
            document.getElementById('gameStateDisplay').textContent = "Saque Inicial";
            document.getElementById('restartMessage').style.display = 'none';
            playersTeamA.forEach((player) => { player.resetToFormation(); });
            playersTeamB.forEach((player) => { player.resetToFormation(); });

            ball.x = centerX; ball.y = centerY; ball.vx = 0; ball.vy = 0;
            if(ball.heldBy) { ball.heldBy.hasBall = false; ball.heldBy = null; }
            ball.isKicked = false; ball.lastTouchedBy = null;

            const concedingTeam = (scoringTeam === 'A') ? playersTeamB : playersTeamA;
            let kicker = concedingTeam.find(p => p.specificRole === 'ST_Finisher') || concedingTeam.find(p => p.specificRole === 'CM_Playmaker') ||  concedingTeam.find(p => p.playerType === 'attacker' && Math.abs(p.baseY - centerY) < 50) || concedingTeam.find(p => p.playerType === 'midfielder' && Math.abs(p.baseY - centerY) < 50) || concedingTeam[Math.floor(concedingTeam.length / 2)];
            if(kicker){
                ball.heldBy = kicker; kicker.hasBall = true;
                ball.x = centerX + (kicker.team === 'A' ? -(ball.radius + kicker.radius + 1) : (ball.radius + kicker.radius + 1));
                ball.y = centerY;
                kicker.x = centerX + (kicker.team === 'A' ? -PLAYER_RADIUS*2.5 : PLAYER_RADIUS*2.5);
                kicker.y = centerY;
            }
        }
        function handleGoal(scoringTeam) {
            if (gameState === 'goalScored' || gameState === 'gameOver') return;
            gameState = 'goalScored';
            restartTimer = RESTART_DELAY_FRAMES * 1.5;
            document.getElementById('gameStateDisplay').textContent = "¡GOL!";
            const scoringTeamName = (scoringTeam === 'A') ? teamAName : teamBName;
            document.getElementById('goalMessage').textContent = `¡GOL de ${scoringTeamName}!`;
            document.getElementById('goalMessage').style.display = 'block';

            const scorer = ball.lastTouchedBy;
            if (scorer && scorer.team === scoringTeam) {
                scorer.stats.goals++;
                if (ball.passData && ball.passData.passerTeam === scoringTeam && ball.passData.passerId !== scorer.id) {
                    const assister = (scoringTeam === 'A' ? playersTeamA : playersTeamB).find(p => p.id === ball.passData.passerId);
                    if (assister) assister.stats.assists++;
                }
            }
            ball.passData = null;

            if (scoringTeam === 'A') { scoreTeamA++; document.getElementById('scoreTeamA').textContent = scoreTeamA;}
            else { scoreTeamB++; document.getElementById('scoreTeamB').textContent = scoreTeamB; }
            if(ball.heldBy) { ball.heldBy.hasBall = false; ball.heldBy = null;}
            ball.vx = 0; ball.vy = 0; ball.x = -3000; ball.y = -3000;
        }
        document.getElementById('resetButton').addEventListener('click', () => {
            const teamAKeyFromURL = urlParams.get('teamA') || "MadridCity";
            const teamBKeyFromURL = urlParams.get('teamB') || "BarcelonaCity";
            initGame(teamAKeyFromURL, teamBKeyFromURL);
        });

        function displayFinalStats() {
            const statsDiv = document.getElementById('statsDisplay');
            let html = `<h2>Estadísticas Finales del Partido</h2>`;
            html += `<p class="text-center mb-4">Resultado: ${teamAName} ${scoreTeamA} - ${scoreTeamB} ${teamBName}</p>`;

            html += `<h3>${teamAName}</h3><table><tr><th>Jugador (Rol)</th><th>G</th><th>A</th><th>T</th><th>P (C/I)</th><th>Rec.</th></tr>`;
            playersTeamA.forEach(p => {
                html += `<tr><td>${p.specificRole}</td><td>${p.stats.goals}</td><td>${p.stats.assists}</td><td>${p.stats.shots}</td><td>${p.stats.passesCompleted}/${p.stats.passesAttempted}</td><td>${p.stats.recoveries}</td></tr>`;
            });
            html += `</table>`;

            html += `<h3 class="mt-4">${teamBName}</h3><table><tr><th>Jugador (Rol)</th><th>G</th><th>A</th><th>T</th><th>P (C/I)</th><th>Rec.</th></tr>`;
            playersTeamB.forEach(p => {
                html += `<tr><td>${p.specificRole}</td><td>${p.stats.goals}</td><td>${p.stats.assists}</td><td>${p.stats.shots}</td><td>${p.stats.passesCompleted}/${p.stats.passesAttempted}</td><td>${p.stats.recoveries}</td></tr>`;
            });
            html += `</table>`;
            statsDiv.innerHTML = html;
            statsDiv.style.display = 'block';
        }

        function gameLoop() {
            if (gameState === 'gameOver') {
                if(document.getElementById('statsDisplay').style.display === 'none') displayFinalStats();
                requestAnimationFrame(gameLoop);
                return;
            }

            if (restartTimer > 0) {
                restartTimer--;
                if (restartTimer === 0) {
                    if (gameState === 'goalScored') {
                        let scorerTeam = 'A';
                        if (document.getElementById('goalMessage').textContent.includes(teamBName)) scorerTeam = 'B';
                        else if (document.getElementById('goalMessage').textContent.includes(teamAName)) scorerTeam = 'A';
                        resetPositionsAfterGoal(scorerTeam);
                        document.getElementById('goalMessage').style.display = 'none';
                    } else if (gameState === 'kickOff' && ball.heldBy) {
                        const kicker = ball.heldBy;
                        let passTargetX = kicker.x + (kicker.team === 'A' ? 100 : -100);
                        let passTargetY = kicker.y + (Math.random() -0.5) * 50;
                        kicker.kick(ball, passTargetX, passTargetY, PASS_STRENGTH_SHORT * 1.1);
                        gameState = 'playing';
                        document.getElementById('gameStateDisplay').textContent = "Jugando";
                        document.getElementById('restartMessage').style.display = 'none';
                    } else if ((gameState === 'preparingFreeKick' || gameState === 'preparingFreeKickFoul') && ball.heldBy){
                        const kicker = ball.heldBy;
                        if (!ball.isKicked) {
                           // La decisión de qué hacer con la falta se toma en decideAction del kicker
                        }
                    }
                }
            }

            if (gameState === 'playing' || gameState.startsWith('preparing')) {
                if (gameState === 'playing') {
                    gameTimeElapsedFrames++;
                    let gameTimeElapsedSeconds = Math.floor(gameTimeElapsedFrames / FRAMES_PER_SECOND);
                    let currentMinuteDisplay = Math.floor((gameTimeElapsedSeconds / TOTAL_MATCH_TIME_SECONDS) * 90);
                    if (currentMinuteDisplay > 90) currentMinuteDisplay = 90;
                    let halfPrefix = currentMinuteDisplay < 45 ? "1T" : "2T";
                    let minuteInHalf = currentMinuteDisplay % 45;
                    if (currentMinuteDisplay >= 90) {
                        halfPrefix = "2T";
                        minuteInHalf = 45;
                        document.getElementById('gameTimeDisplay').textContent = `${halfPrefix} ${String(minuteInHalf).padStart(2, '0')}' +`;
                    } else {
                         document.getElementById('gameTimeDisplay').textContent = `${halfPrefix} ${String(minuteInHalf).padStart(2, '0')}'`;
                    }


                    if (gameTimeElapsedSeconds >= TOTAL_MATCH_TIME_SECONDS && gameState === 'playing') {
                        gameState = 'gameOver';
                        document.getElementById('gameStateDisplay').textContent = "Fin del Partido";
                        const finalScoreMessage = `Fin: ${teamAName} ${scoreTeamA} - ${scoreTeamB} ${teamBName}`;
                        document.getElementById('restartMessage').textContent = finalScoreMessage;
                        document.getElementById('restartMessage').style.display = 'block';
                    }
                    if (gameTimeElapsedFrames % (FRAMES_PER_SECOND * 10) === 0) {
                        updateTeamTacticsDynamic();
                        updateTeamPlayWidthDynamic();
                    }
                }

                ctx.clearRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT); drawField();
                const allPlayers = [...playersTeamA, ...playersTeamB];

                if(gameState === 'playing') ball.update();
                else if (ball.heldBy && gameState !== 'preparingThrowIn') {
                    ball.x = ball.heldBy.x + (ball.heldBy.team === 'A' ? ball.radius + ball.heldBy.radius + 1 : -(ball.radius + ball.heldBy.radius + 1));
                    ball.y = ball.heldBy.y;
                } else if (ball.heldBy && gameState === 'preparingThrowIn') {
                    // La posición del balón ya está en la línea de banda.
                }

                playersTeamA.forEach(player => player.update(ball, allPlayers));
                playersTeamB.forEach(player => player.update(ball, allPlayers));

                allPlayers.forEach(player => { if (ball.heldBy === player) { player.hasBall = true; } else { player.hasBall = false; } });

                playersTeamA.forEach(player => player.draw());
                playersTeamB.forEach(player => player.draw());
                ball.draw();
            } else if (gameState === 'goalScored' || gameState === 'gameOver') {
                ctx.clearRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT); drawField();
                const allPlayers = [...playersTeamA, ...playersTeamB];
                allPlayers.forEach(player => player.draw());
                if (gameState === 'goalScored' && ball.x > -2000) ball.draw();
            }
            requestAnimationFrame(gameLoop);
        }

        const teamAKeyFromURL = urlParams.get('teamA');
        const teamBKeyFromURL = urlParams.get('teamB');

        initGame(teamAKeyFromURL, teamBKeyFromURL);
        gameLoop();

        // --- Script del Manager (adaptado para esta página) ---
        const USER_TEAM_KEY_MGR = "user_team"; // Usar un nombre diferente para evitar colisiones si es necesario
        const TEAMS_DATA_MGR = { // Usar un nombre diferente
            [USER_TEAM_KEY_MGR]: { name: "Mi Equipo CF", color: "#FFD700", initialTactic: "equilibrado", initialPlayWidth: "normal", formation: [] },
            "MadridCity": { name: "Madrid City", color: "#FFFFFF", initialTactic: "ofensivo", initialPlayWidth: "normal", formation: [] },
            "BarcelonaCity": { name: "Barcelona City", color: "#004D98", initialTactic: "equilibrado", initialPlayWidth: "wide", formation: [] },
            "RojoGenerico": { name: "Rojos CF", color: "#E53E3E", initialTactic: "equilibrado", initialPlayWidth: "normal", formation: [] },
            "AzulGenerico": { name: "Azules FC", color: "#3182CE", initialTactic: "defensivo", initialPlayWidth: "narrow", formation: [] }
        };
        // Datos de ejemplo para el calendario y noticias, pueden ser simplificados o eliminados si no son estrictamente necesarios para el *aspecto*
        const MATCH_SCHEDULE_MGR = [ { dayOffset: 0, opponentKey: "RojoGenerico", location: "Local" }, { dayOffset: 2, opponentKey: "BarcelonaCity", location: "Visitante" }];
        const FICTITIOUS_NEWS_MGR = [
            { title: "¡Simulador Activo!", content: `Actualmente estás viendo el simulador de partidos. Haz clic en "Volver al Manager" para regresar.`, dateOffset: 0 },
            { title: "Análisis Pre-partido", content: `Expertos analizan el crucial enfrentamiento de mañana.`, dateOffset: -1 }
        ];

        const customAlertOverlayMgr = document.getElementById('customAlertOverlay');
        const customAlertMessageMgr = document.getElementById('customAlertMessage');
        const customAlertOkButtonMgr = document.getElementById('customAlertOkButton');
        const calendarStripMgr = document.getElementById('calendar-strip');
        // const newsFeedMgr = document.getElementById('news-feed'); // No hay news-feed en esta página
        const sidebarLinksMgr = document.querySelectorAll('#sidebar .sidebar-link'); // Ser más específico con el selector de la sidebar
        const sectionContentsMgr = document.querySelectorAll('main .section-content'); // Ser más específico

        const headerTeamNameMgr = document.getElementById('header-team-name');
        const headerTeamLevelMgr = document.getElementById('header-team-level');
        const headerTeamXpCurrentMgr = document.getElementById('header-team-xp-current');
        const headerTeamXpNextMgr = document.getElementById('header-team-xp-next');
        const headerTeamXpBarFillMgr = document.getElementById('team-xp-bar-fill-header');
        const headerDateDisplayMgr = document.getElementById('header-date');
        const headerTimeDisplayMgr = document.getElementById('header-time');

        function showCustomAlertMgr(message) { if(customAlertMessageMgr) customAlertMessageMgr.textContent = message; if(customAlertOverlayMgr) customAlertOverlayMgr.classList.add('visible'); }
        if(customAlertOkButtonMgr) customAlertOkButtonMgr.addEventListener('click', () => {if(customAlertOverlayMgr) customAlertOverlayMgr.classList.remove('visible')});

        function loadMyTeamDataMgr() {
            const userTeamData = TEAMS_DATA_MGR[USER_TEAM_KEY_MGR];
            if (userTeamData) {
                if(headerTeamNameMgr) headerTeamNameMgr.textContent = userTeamData.name;
                if(headerTeamLevelMgr) headerTeamLevelMgr.textContent = "1";
                if(headerTeamXpCurrentMgr) headerTeamXpCurrentMgr.textContent = "105";
                if(headerTeamXpNextMgr) headerTeamXpNextMgr.textContent = "350";
                if(headerTeamXpBarFillMgr) headerTeamXpBarFillMgr.style.width = `${(105/350)*100}%`;
            }
        }

        function renderCalendarMgr() {
            if (!calendarStripMgr) return;
            calendarStripMgr.innerHTML = ''; const dayNames = ["L", "M", "X", "J", "V", "S", "D"]; const today = new Date();
            for (let i = 0; i < 7; i++) {
                const dayDate = new Date(today); dayDate.setDate(today.getDate() + i);
                const dayDiv = document.createElement('div'); dayDiv.classList.add('calendar-day', 'mx-1', 'py-2', 'sm:flex-1');
                const dayNameSpan = document.createElement('span'); dayNameSpan.classList.add('day-name'); dayNameSpan.textContent = dayNames[(dayDate.getDay() + 6) % 7];
                const dayNumberSpan = document.createElement('span'); dayNumberSpan.classList.add('day-number'); dayNumberSpan.textContent = dayDate.getDate();
                dayDiv.appendChild(dayNameSpan); dayDiv.appendChild(dayNumberSpan);
                const scheduledMatch = MATCH_SCHEDULE_MGR.find(match => match.dayOffset === i);
                if (scheduledMatch) {
                    dayDiv.classList.add('match-day');
                    const matchInfoSpan = document.createElement('span'); matchInfoSpan.classList.add('match-info');
                    const opponentName = TEAMS_DATA_MGR[scheduledMatch.opponentKey]?.name || 'Desconocido';
                    matchInfoSpan.textContent = `VS ${opponentName.substring(0,7)}... (${scheduledMatch.location === 'Local' ? 'L': 'V'})`;
                    dayDiv.appendChild(matchInfoSpan);
                    // No añadir listener de click aquí ya que estamos en el simulador
                }
                const progressContainer = document.createElement('div'); progressContainer.classList.add('day-progress-bar-container');
                const progressBar = document.createElement('div'); progressBar.classList.add('day-progress-bar');
                if (i === 0) { dayDiv.classList.add('current'); progressBar.style.width = `100%`; } else { progressBar.style.width = `0%`; }
                progressContainer.appendChild(progressBar); dayDiv.appendChild(progressContainer); calendarStripMgr.appendChild(dayDiv);
            }
        }

        function updateClockMgr() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            if (headerTimeDisplayMgr) headerTimeDisplayMgr.textContent = `${hours}:${minutes}`;
            if (headerDateDisplayMgr) headerDateDisplayMgr.textContent = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }); // Simplificado para demo
        }

        sidebarLinksMgr.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const sectionToShow = link.dataset.section;

                // Si el enlace no es para "simulador", podría redirigir a index.html con el parámetro de sección
                // o simplemente no hacer nada si no queremos funcionalidad completa de navegación aquí.
                if (sectionToShow !== "simulador") {
                    // Opcional: showCustomAlertMgr(`Navegación a '${sectionToShow}' iría a otra página.`);
                    // Por ahora, solo cambia el estado activo visualmente y oculta el simulador
                    // si la página tuviera otros divs de contenido.
                    console.log("Intentando navegar a sección:", sectionToShow);
                }

                sectionContentsMgr.forEach(content => content.classList.add('hidden'));
                const activeSection = document.getElementById(`content-${sectionToShow}`);
                if (activeSection) {
                    activeSection.classList.remove('hidden');
                } else {
                    // Si la sección no existe (ej. "inicio"), el simulador permanecerá oculto
                    // Aseguramos que si se hace clic en el enlace "Simulador", este se muestre
                    if (sectionToShow === "simulador") {
                        document.getElementById('content-simulador').classList.remove('hidden');
                    }
                }

                sidebarLinksMgr.forEach(s_link => s_link.classList.remove('active'));
                link.classList.add('active');
            });
        });

        function initializeManagerAppearance() {
            loadMyTeamDataMgr();
            renderCalendarMgr();
            updateClockMgr();
            setInterval(updateClockMgr, 60000); // Actualizar reloj cada minuto

            // Asegurar que la sección del simulador esté visible y el enlace activo
            sectionContentsMgr.forEach(content => content.classList.add('hidden'));
            const simContent = document.getElementById('content-simulador');
            if (simContent) simContent.classList.remove('hidden');

            sidebarLinksMgr.forEach(s_link => s_link.classList.remove('active'));
            const simLink = document.querySelector('#sidebar .sidebar-link[data-section="simulador"]');
            if (simLink) simLink.classList.add('active');
        }

        document.addEventListener('DOMContentLoaded', initializeManagerAppearance);

    </script>
