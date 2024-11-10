import useComment from '@/hooks/useComment';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';

const CommentSection: React.FC<{ moduleId: string }> = ({ moduleId }) => {
  const pageRef = useRef<number>(1);
  const [refreshComments, setRefreshComments] = useState(0);
  const { comments = [] } = useComment(moduleId, pageRef.current, refreshComments);
  const [newComment, setNewComment] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const commentSend = {
        moduleId: moduleId,
        content: newComment
      };
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      await axios.post(`${SERVER_URI}/api/Video/PostComment`, commentSend, {
        headers: {
          "Cookie": token?.toString()
        }
      })
      .then((res) => {
        setLoading(false);
        setRefreshComments((prev) => prev + 1);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });

      setNewComment('');
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (secondsAgo < 60) return `${secondsAgo} giây trước`;
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo} phút trước`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) return `${hoursAgo} giờ trước`;
    const daysAgo = Math.floor(hoursAgo / 24);
    return `${daysAgo} ngày trước`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bình luận</Text>
      
      <ScrollView style={styles.commentList}>
        {comments?.length > 0 ? (
          comments?.map((comment) => (
            <View key={comment.id} style={styles.commentContainer}>
              <Image
                source={{ uri: comment.subUser.user_avatar || 
                  'https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png' }}
                style={styles.avatar}
              />
              <View style={styles.commentContentContainer}>
                <Text style={styles.commentUser}>{comment.subUser.user_name}</Text>
                <Text style={styles.commentContent}>{comment.content}</Text>
                <Text style={styles.commentDate}>{formatTimeAgo(new Date(comment.cDate))}</Text>
                <View style={styles.likeDislikeContainer}>
                  <Text>{comment.like} 👍</Text>
                  <Text>{comment.dislike} 👎</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noComments}>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</Text>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Viết bình luận..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.button}>
          <Text style={styles.buttonText}>Bình luận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  commentList: { maxHeight: 200 },
  commentContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  commentContentContainer: { flex: 1 },
  commentUser: { fontWeight: 'bold', color: '#333' },
  commentContent: { color: '#555' },
  commentDate: { color: '#888', fontSize: 12, marginTop: 4 },
  likeDislikeContainer: { flexDirection: 'row', justifyContent: 'space-between', width: 80, marginTop: 4 },
  noComments: { color: '#999', fontStyle: 'italic' },
  inputContainer: { flexDirection: 'column', marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 },
  button: { alignSelf: 'flex-end', marginTop: 8, backgroundColor: '#007BFF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 4 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default CommentSection;
