type Scene = {
    stage: Stage;
    cameraMode?: Camera.Mode;
    schema: Schema;
    cutscenes: Dict<Cutscene>;
    entry?: string;
    defaultControl: string[];
}
