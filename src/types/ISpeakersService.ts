export type Speakers = {
  member_id: number;
  speaker_position: number;
};

export type ListSpeakers = {
  name: string;
  last_speech_date: string;
  speaker_position: number;
  sundays_since_last_speech: string;
};

export type ChurchMembers = {
  id: number;
  name: string;
  ward_id: number;
};

export interface ISpeakersService {
  create(
    sacrament_meeting_date: Date,
    ward_id: number,
    speakers: Speakers[]
  ): Promise<void>;
  listAllSpeakers(wardId: number): Promise<ListSpeakers[]>;
  listChurchMembers(wardId: number): Promise<ChurchMembers[]>;
}
