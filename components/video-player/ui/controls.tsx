import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { VideoPlayer } from "expo-video";
import { TouchableOpacity, View } from "react-native";

type Props = {
  player: VideoPlayer;
  paused: boolean;
  saveVideo: () => Promise<void>;
  hidden?: boolean;
};

export const VideoControls = ({ paused, player, saveVideo, hidden }: Props) => {
  const router = useRouter();

  if (hidden) return;

  const turnBack = () => {
    router.replace("/camera");
  };

  const handleSave = async () => {
    try {
      await saveVideo();
      turnBack();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = () => {
    turnBack();
  };

  return (
    <View className="z-10 pb-5 flex justify-center items-end flex-row gap-5">
      <TouchableOpacity
        className="mb-[10px]"
        onPress={() => {
          if (!paused) {
            player.pause();
          } else {
            player.play();
          }
        }}
      >
        <Ionicons
          color="white"
          name={!paused ? "pause-circle-outline" : "play-circle-outline"}
          size={50}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSave}>
        <Ionicons name="add-circle" size={70} color="white" />
      </TouchableOpacity>
      <TouchableOpacity className="mb-[10px]" onPress={handleClose}>
        <Ionicons size={50} name="close-circle-outline" color="white" />
      </TouchableOpacity>
    </View>
  );
};
