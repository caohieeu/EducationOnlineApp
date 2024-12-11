import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { SERVER_URI } from '@/utils/uri';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'react-native-toast-notifications';

export default function useGetVideoDetail(idVideo: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoInfor, setVideoInfor] = useState<VideoSingle | null>(null);

  useEffect(() => {
    const fetchVideoDetail = async () => {
      if (!idVideo) {
        setLoading(false);
        setError("Video ID không hợp lệ.");
        Toast.show('ID không hợp lệ', { type: 'error', duration: 1400 });
        return;
      }

      setLoading(true); 

      try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) {
          throw new Error("Token không tồn tại.");
        }

        const response = await axios.get(`${SERVER_URI}/api/Video/getVideo/${idVideo}`, {
            headers: {
              "Cookie": token?.toString(),
            },
        });
        Toast.show("Thành công", { type: 'success', duration: 1400 });
        setVideoInfor(response.data);

      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi khi lấy chi tiết video.");
        Toast.show(err.message || 'Error fetching video details', { type: 'error', duration: 1400 });
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetail();
  }, [idVideo]);

  return useMemo(() => ({ loading, error, videoInfor }), [loading, error, videoInfor]);
}
