export type Speakers = {
  member_id: number;
  speaker_position: number;
};

export interface ISpeakersService {
  create(
    sacrament_meeting_date: Date,
    ward_id: number,
    speakers: Speakers[]
  ): Promise<void>;
}
