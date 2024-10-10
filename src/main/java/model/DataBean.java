package model;

import java.util.ArrayList;
import java.util.List;

public class DataBean {
    private List<RPoint> data = new ArrayList<>();

    public List<RPoint> getData() {
        return data;
    }

    public void addRPoint(RPoint point) {
        data.add(point);
    }

    public void setData(List<RPoint> data) {
        this.data = data;
    }
}
